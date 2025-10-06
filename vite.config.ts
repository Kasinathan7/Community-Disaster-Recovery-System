import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // <-- Use "./" for GitHub Pages + Vite
  plugins: [react()],
});
