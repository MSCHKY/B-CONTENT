import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [react(), tailwindcss(), cloudflare()],
    resolve: {
        alias: [
            { find: "@/", replacement: "/src/app/" },
            { find: "@data/", replacement: "/src/data/" },
        ],
    },
    // Allow serving font files from parent directory
    server: {
        fs: {
            allow: [".."],
        },
    },
});
