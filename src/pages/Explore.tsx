import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Baby, CalendarDays, Heart, LockKeyhole, Sparkles, CheckCircle2 } from "lucide-react";
import GradientButton from "@/components/GradientButton";
import WombAnimation from "@/components/WombAnimation";
import SisterlyLogo from "@/components/SisterlyLogo";

const tabs = [
  { id: "cycle", label: "Cycle & fertility", icon: CalendarDays },
  { id: "pregnancy", label: "Pregnancy", icon: Heart },
  { id: "baby", label: "Baby care", icon: Baby },
] as const;
type Tab = typeof tabs[number]["id"];

const Explore = () => {
  const [active, setActive] = useState<Tab>("cycle");
  const [showDetails, setShowDetails] = useState(false);
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass">
        <div className="container mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><SisterlyLogo size={36} /><span className="font-serif font-bold text-lg">SISTERLY</span></Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/auth"><GradientButton variant="cta" size="sm">Sign up</GradientButton></Link>
          </div>
        </div>
      </header>

      <section className="gradient-hero overflow-hidden">
        <div className="container mx-auto px-6 py-12 md:py-16 grid md:grid-cols-[1.15fr_.85fr] items-center gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6"><ArrowLeft className="w-4 h-4"/> Back to home</Link>
            <p className="text-xs uppercase tracking-[.2em] font-semibold text-primary mb-3">Explore SISTERLY</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">A preview of care, <span className="text-transparent bg-clip-text gradient-accent">every step of the way.</span></h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl">Take a guided look at the tools and information SISTERLY brings together. No account or personal health information is needed to explore.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#preview"><GradientButton variant="cta" size="lg">View sample dashboard <ArrowRight className="w-4 h-4 ml-2"/></GradientButton></a>
              <Link to="/auth"><GradientButton variant="outline" size="lg">Create your account</GradientButton></Link>
            </div>
          </div>
          <div className="flex justify-center"><WombAnimation compact /></div>
        </div>
      </section>

      <section id="preview" className="container mx-auto px-5 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-[.2em] text-primary font-semibold">Interactive sample</p>
          <h2 className="text-3xl font-serif font-bold mt-2">Explore the experience</h2>
          <p className="text-sm text-muted-foreground mt-3">Switch between sample areas. These values are illustrative examples, not predictions about you.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          {tabs.map(({id,label,icon:Icon}) => <button key={id} onClick={()=>{setActive(id);setShowDetails(false)}} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${active===id ? "gradient-cta text-white shadow-soft" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}><Icon className="w-4 h-4"/>{label}</button>)}
        </div>

        <div className="max-w-4xl mx-auto rounded-[2rem] bg-card border border-border shadow-elevated p-5 md:p-8">
          {active === "cycle" && <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="w-4 h-4"/> Sample cycle overview</div>
              <h3 className="font-serif text-2xl font-bold mt-3">Your cycle, made easier to understand.</h3>
              <p className="text-sm text-muted-foreground mt-2">A sample overview can help explain cycle phases, symptoms and fertility signs in one place.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Example cycle length</p><p className="text-2xl font-semibold mt-1">28 days</p></div>
                <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Cycle phase</p><p className="text-lg font-semibold mt-1">Follicular</p></div>
              </div>
            </div>
            <div className="rounded-3xl gradient-hero p-6">
              <p className="text-sm font-semibold mb-5">Illustrative cycle timeline</p>
              <div className="flex gap-1.5 h-4 rounded-full overflow-hidden"><div className="bg-[#D98C9D] w-[22%]"/><div className="bg-[#EFC6D7] w-[28%]"/><div className="bg-[#A98ACD] w-[12%]"/><div className="bg-[#C8B8E0] flex-1"/></div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-5 text-xs"><span>● Menstrual</span><span>● Follicular</span><span>● Ovulation</span><span>● Luteal</span></div>
              <p className="text-xs text-muted-foreground mt-5">Cycle lengths and ovulation timing vary. Calendar estimates cannot confirm ovulation or prevent pregnancy.</p>
            </div>
          </div>}
          {active === "pregnancy" && <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
            <div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Heart className="w-4 h-4"/> Sample pregnancy journey</div><h3 className="font-serif text-2xl font-bold mt-3">Understand each new milestone.</h3><p className="text-sm text-muted-foreground mt-2">A personal pregnancy space can bring together gestational-age notes, appointment reminders and educational weekly content.</p>
              <div className="flex gap-3 mt-6"><div className="rounded-2xl bg-muted/50 p-4 flex-1"><p className="text-xs text-muted-foreground">Example week</p><p className="text-2xl font-semibold mt-1">18</p></div><div className="rounded-2xl bg-muted/50 p-4 flex-1"><p className="text-xs text-muted-foreground">Trimester</p><p className="text-lg font-semibold mt-1">Second</p></div></div>
            </div>
            <div className="rounded-3xl gradient-pregnancy p-6"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Journey progress</span><span className="text-xs">Illustrative</span></div><div className="h-3 bg-white/60 rounded-full mt-5 overflow-hidden"><div className="h-full rounded-full bg-[#9A78BD]" style={{width:"42%"}}/></div><div className="flex justify-between text-xs mt-2"><span>Week 1</span><span>Week 40</span></div><div className="mt-7 rounded-2xl bg-white/60 p-4"><p className="font-semibold">Weekly learning</p><p className="text-sm text-muted-foreground mt-1">Explore development information and questions to discuss with your maternity care team.</p></div></div>
          </div>}
          {active === "baby" && <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
            <div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Baby className="w-4 h-4"/> Sample baby profile</div><h3 className="font-serif text-2xl font-bold mt-3">Keep precious milestones together.</h3><p className="text-sm text-muted-foreground mt-2">A family space for recording growth measurements, feeding notes, sleep routines, vaccinations and first milestones.</p><div className="grid grid-cols-2 gap-3 mt-6"><div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Sample age</p><p className="text-2xl font-semibold mt-1">4 months</p></div><div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Next milestone</p><p className="text-lg font-semibold mt-1">Rolling</p></div></div></div>
            <div className="rounded-3xl gradient-hero p-6"><div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto"><Baby className="w-8 h-8 text-primary"/></div><p className="text-center font-serif text-xl font-bold mt-4">Little moments matter</p><div className="space-y-3 mt-5">{["Growth measurements","Feeding & sleep journal","Vaccination reminders"].map((s)=><div key={s} className="rounded-xl bg-white/70 p-3 flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary"/>{s}</div>)}</div></div>
          </div>}
          <div className="mt-7 pt-5 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground flex items-center gap-2"><LockKeyhole className="w-4 h-4"/> Personal records are available after secure sign-in.</p>
            <button onClick={()=>setShowDetails(v=>!v)} className="text-sm font-semibold text-primary hover:underline">{showDetails ? "Hide details" : "What can I do with an account?"}</button>
          </div>
          {showDetails && <div className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground mb-2">With a free account you can:</p><ul className="list-disc pl-5 space-y-1"><li>Save your own cycle, pregnancy or baby records.</li><li>Personalise your profile and preferences.</li><li>Access your information across supported devices.</li><li>Explore advanced insights and account features as they become available.</li></ul></div>}
        </div>
      </section>

      <section className="gradient-hero py-14">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center mx-auto"><Sparkles className="text-white"/></div>
          <h2 className="font-serif text-3xl font-bold mt-4">Ready to make it yours?</h2>
          <p className="text-muted-foreground mt-3">Create an account to save your own information and unlock personalised features.</p>
          <Link to="/auth" className="inline-block mt-6"><GradientButton variant="cta" size="lg">Sign up for advanced features <ArrowRight className="w-4 h-4 ml-2"/></GradientButton></Link>
          <p className="text-xs text-muted-foreground mt-4">You can continue exploring without creating an account.</p>
        </div>
      </section>
      <footer className="py-7 text-center text-xs text-muted-foreground">SISTERLY · Health education and tracking, not medical diagnosis.</footer>
    </main>
  );
};
export default Explore;
