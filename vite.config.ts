import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { copy } from "vite-plugin-copy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/ponpoko/",
    plugins: [
      vue(),
      copy({
        targets: [{ src: ".htaccess", dest: "docs" }]
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
