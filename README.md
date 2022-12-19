# 创建项目
vanillajs （最牛逼的js框架，就是js^_^）
```
yarn create vite areact --template vanilla
```
# 运行
```
yarn
yarn add -D vitest
```
# 配置vitest
参看：https://cn.vitest.dev/guide/features.html
```
yarn add -D happy-dom
// vite.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "happy-dom", // or 'jsdom', 'node'
  },
});
```