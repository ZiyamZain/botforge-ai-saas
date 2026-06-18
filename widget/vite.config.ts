import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  build: {
    lib: {
      entry: "./src/main.tsx",
      name: "ChatbotWidget",
      fileName: () => "widget.js",
      formats: ["iife"], // single self-executing file
    },
    rollupOptions: {
      external: [], // bundle everything including React
    },
  },
});
