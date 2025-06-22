import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  exportBuild: {
    entry: "./src/index.html",
    rollupOptions: {
      input: "./src/index.html",
      output: {
        dir: "dist",
        assetsDir: "",
        lintOnSave: false,
        publicPath: "./",
      },
    },
  },
});
