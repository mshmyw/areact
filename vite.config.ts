// vite.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
  },
  esbuild: {
    // jsxFactory 告诉esbuild 如何编译jsx
    jsxFactory: 'AReact.createElement'
  }
});
