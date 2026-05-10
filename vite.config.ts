import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { copy } from "vite-plugin-copy";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/ponpoko/",
    plugins: [
      vue(),
      copy({
        targets: [{ src: ".htaccess", dest: "docs" }]
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico"],
        manifest: {
          name: "ぽんぽこ商会",
          short_name: "ぽんぽこ商会",
          lang: "ja",
          start_url: "/ponpoko/",
          scope: "/ponpoko/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            {
              src: "icons/icon-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    build: {
      outDir: "docs"
    },
    server: {
      host: "0.0.0.0", // 全てのネットワークインターフェースでアクセスを許可するために 0.0.0.0 を使用
      port: 8080,
      watch: {
        usePolling: true
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$vite_app_title: "${env.VITE_APP_TITLE || ""}";`,
        },
      },
    },
  };
});
