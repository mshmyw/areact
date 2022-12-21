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
# learn2
上述 同步模式 基于递归栈 无法中断（react 16之前）对应DOM 树
接下来的异步模式更新 可中断 基于fiber队列 对应Fiber树（更准确说是Fiber链表结构）
异步模式需要开启（默认不开启）renderRootConcurrent
## fiber 遍历顺序：
先遍历child 然后是sibling 最后是return 父节点或兄弟
fiber 双缓冲，render 阶段会创建alternate fiber树，commit阶段会将current 树切换到alternate fiber树

## fiber 数据结构关键
链表相关(与遍历有关）：child sibling return
静态结构（保存组件类型和对应dom信息，一个fiber节点对应了React element）：tag type stateNode key
优先级 lanes childLanes
alternate 双缓存+current
动态工作单元 flags nextEffect firstEffect lastEffect
pendingProps memoizedProps updateQueue memoizedState dependencies

### 实现关键点
workloop workinprocess/alternate/current双缓冲 fiber链表遍历 requestidlecallback

reference：
Workloop：https://github.com/facebook/react/blob/4f29ba1cc52061e439cede3813e100557b23a15c/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L1824-L1829
https://github.com/facebook/react/issues/7942
React act case：https://github.com/facebook/react/blob/17806594cc28284fe195f918e8d77de3516848ec/packages/react/src/__tests__/ReactStrictMode-test.internal.js#L87-L108