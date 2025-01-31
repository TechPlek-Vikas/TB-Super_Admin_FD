import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

/** @type process: NodeJS.Process */

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        // "/api/v2": "http://localhost:5000",
        "/api/v2": env.VITE_API_BASE_URL,
      },
    },
    plugins: [react()],
  };
});
