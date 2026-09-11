import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vite";

function contentSecurityPolicy(isDev: boolean): Plugin {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    isDev ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  return {
    name: "employee-management:content-security-policy",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: policy,
          },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [contentSecurityPolicy(command === "serve")],
  resolve: {
    alias: {
      // Mirrors the "@/*" path in tsconfig.json. Keep the two in step.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    modulePreload: { polyfill: false },
  },
}));
