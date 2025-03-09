import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/restaurant-finder-frontend/",
  plugins: [react()],
  server: {
    port: 4000,
  },
});
