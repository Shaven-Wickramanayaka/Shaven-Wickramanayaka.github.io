import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [topLevelAwait()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        contact: './contact.html',
        projects: './projects.html',
      }
    }
  }
});
