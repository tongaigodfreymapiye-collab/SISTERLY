import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const githubRepoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "SISTERLY";
export default defineConfig(({ mode }) => ({
  // GitHub Pages project sites are served from /<repository-name>/.
  // Keep local development at / and make production builds work both in Actions and locally.
  base: mode === "production" ? `/${githubRepoName}/` : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
