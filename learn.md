# TDD
测试驱动开发
  方法：在开发功能代码之前，先编写单元测试代码，测试通过，则功能完成
好处：
- 主流：尤其使用框架层代码开发
- 与解决问题思路相同：测试代码就像prd,梳理你的思路
- 高质量：能够保证功能代码完备性
- 心流：全程vscode中完成，无任务切换
# learn1 参考
Vite 特性介绍：https://vitest.dev/guide/features.html
Vitest debug 方法：https://vitest.dev/guide/debugging.html
# jsx
esbuild 的 JSX 特性支持：https://esbuild.github.io/content-types/#jsx
## 同步渲染
基于栈的递归
https://developer.mozilla.org/en-US/docs/Web/API/Element/className
> 再次理解下回调函数
```
  esbuild: {
    // jsxFactory 告诉esbuild 如何编译jsx
    jsxFactory: 'AReact.createElement'
  }
```
这里的AReact.createElement其实应该就是一种回调
函数，由外部提供定义，esbuild内部会调用它，
调用者会给它传具体的参数，以及可能会使用它的返回