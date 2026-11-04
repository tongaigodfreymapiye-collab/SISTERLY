import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updatePassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = getApps().length ? getApps()[0] : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** A small Firestore adapter preserving the existing page data calls during migration. */
class CollectionRequest {
  private filters: Array<[string, unknown]> = [];
  private sort?: [string, "asc" | "desc"];
  private max?: number;
  private action: "read" | "insert" | "upsert" | "update" | "delete" = "read";
  private payload: any;
  private singleRow = false;
  constructor(private name: string) {}
  select(_fields = "*") { return this; }
  eq(field: string, value: unknown) { this.filters.push([field, value]); return this; }
  order(field: string, opts?: { ascending?: boolean }) { this.sort = [field, opts?.ascending === false ? "desc" : "asc"]; return this; }
  limit(n: number) { this.max = n; return this; }
  insert(data: any) { this.action = "insert"; this.payload = data; return this; }
  upsert(data: any, _options?: any) { this.action = "upsert"; this.payload = data; return this; }
  update(data: any) { this.action = "update"; this.payload = data; return this; }
  delete() { this.action = "delete"; return this; }
  singleResult() { this.singleRow = true; return this; }
  single() { this.singleRow = true; return this; }
  maybeSingle() { this.singleRow = true; return this; }
  then(resolve: (v: any) => any, reject?: (e: any) => any) { return this.run().then(resolve, reject); }
  private async run() {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Please sign in to access your records.");
      const col = collection(db, this.name);
      if (this.action === "insert" || this.action === "upsert") {
        const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
        const saved = [];
        for (const row of rows) {
          const body = { ...row, owner_uid: uid, updated_at: new Date().toISOString() };
          if (this.action === "upsert" && row.user_id && row.log_date) {
            const existing = await getDocs(query(col, where("owner_uid", "==", uid), where("log_date", "==", row.log_date)));
            if (!existing.empty) {
              await updateDoc(existing.docs[0].ref, body);
              saved.push({ id: existing.docs[0].id, ...body });
              continue;
            }
          }
          const ref = await addDoc(col, { ...body, created_at: new Date().toISOString() });
          saved.push({ id: ref.id, ...body });
        }
        return { data: this.singleRow ? saved[0] ?? null : saved, error: null };
      }
      const constraints: any[] = [where("owner_uid", "==", uid)];
      for (const [field, value] of this.filters) if (field !== "id") constraints.push(where(field, "==", value));
            const snap = await getDocs(query(col, ...constraints));
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (this.sort) rows.sort((a: any, b: any) => { const av = a[this.sort![0]] ?? ""; const bv = b[this.sort![0]] ?? ""; return (av < bv ? -1 : av > bv ? 1 : 0) * (this.sort![1] === "asc" ? 1 : -1); });
      if (this.max) rows.splice(this.max);
      if (this.action === "update" || this.action === "delete") {
        const target = rows.find(r => this.filters.some(([f,v]) => f === "id" && r.id === v));
        if (target) {
          if (this.action === "delete") await deleteDoc(doc(db, this.name, target.id));
          else await updateDoc(doc(db, this.name, target.id), { ...this.payload, updated_at: new Date().toISOString() });
        }
        return { data: target ?? null, error: null };
      }
      return { data: this.singleRow ? rows[0] ?? null : rows, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error?.message || "Firebase operation failed" } };
    }
  }
}
export const firebaseStore = {
  from: (name: string) => new CollectionRequest(name),
  auth: {
    signUp: async ({ email, password, options }: any) => {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = options?.data?.display_name;
        if (displayName) await updateProfile(result.user, { displayName });
        await setDoc(doc(db, "profiles", result.user.uid), { id: result.user.uid, owner_uid: result.user.uid, display_name: displayName || email.split("@")[0], email, created_at: new Date().toISOString() });
        return { data: { user: result.user }, error: null };
      } catch (error: any) { return { data: null, error: { message: error.message } }; }
    },
    signInWithPassword: async ({ email, password }: any) => {
      try { const result = await signInWithEmailAndPassword(auth, email, password); return { data: { user: result.user }, error: null }; }
      catch (error: any) { return { data: null, error: { message: error.message } }; }
    },
    resetPasswordForEmail: async (email: string, _options?: any) => {
      try { await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}${import.meta.env.BASE_URL}reset-password`, handleCodeInApp: false }); return { error: null }; }
      catch (error: any) { return { error: { message: error.message } }; }
    },
    updateUser: async ({ password }: any) => {
      try { if (!auth.currentUser) throw new Error("Password reset session expired. Request a new link."); await updatePassword(auth.currentUser, password); return { error: null }; }
      catch (error: any) { return { error: { message: error.message } }; }
    },
    onAuthStateChange: (callback: (event: string, user: any) => void) => {
      const unsubscribe = onAuthStateChanged(auth, user => callback(user ? "SIGNED_IN" : "SIGNED_OUT", user));
      return { data: { subscription: { unsubscribe } } };
    },
    getSession: async () => ({ data: { session: auth.currentUser ? { user: auth.currentUser } : null } }),
    signOut: async () => signOut(auth),
  },
};
