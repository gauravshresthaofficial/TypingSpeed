import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/TypingSpeed/",
  root: ".",
  publicDir: "public",

  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/quotes.json", // Source path
          dest: "src", // Destination in dist folder
        },
      ],
    }),
  ],

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // Enable proper JSON handling
  json: {
    stringify: false,
  },
});
