import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { copy } from "vite-plugin-copy";
import fs from "fs";

// カスタムプラグイン：開発時もfaviconを動的にコピー
const dynamicFavicon = (env: Record<string, string>) => {
  return {
    name: 'dynamic-favicon',
    buildStart() {
      const sourcePath = env.VITE_APP_TITLE === 'santex' 
        ? "src/assets/origin/santex/favicon.ico" 
        : "src/assets/origin/sanwa/favicon.ico";
      
      const destPath = "public/favicon.ico";
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✓ Favicon copied from ${sourcePath} to ${destPath}`);
      } catch (error) {
        console.error(`✗ Failed to copy favicon: ${error}`);
      }
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    base: "/ponpoko/",
    plugins: [
      vue(),
      dynamicFavicon(env),
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
