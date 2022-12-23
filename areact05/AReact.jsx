import { resolve } from "path";
import "../requestIdleCallbackPolyfill";
const textType  = 'HostText';
const createTextElement = (text) => {
  return {
    type: textType,
    props: {
      nodeValue: text,
      children: []
     }
  };
};
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 注意flat 拍平数组，exp [1,2,[3,4]] => [1,2,3,4]
      children: children.flat().map(child => {
        return typeof child !== 'object' ? createTextElement(child): child;
      })
     }
  };
}

// 当前执行的任务
let workInProgress = null;
let workInProgressRoot = null; // 保存整个fiberroot
let currentHookFiber = null;
let currentHookIndex = 0;
class AReactDomRoot {
  _internalRoot = null;
  constructor(container) {
    this._internalRoot = {
      current: null,
      containerInfo: container
    };
  }
  render(element) {
    this._internalRoot.current = {
      alternate: {
        stateNode: this._internalRoot.containerInfo,
        props: {
          children: [element]
         }
      }
    };
    workInProgressRoot = this._internalRoot;
    workInProgress = workInProgressRoot.current.alternate;
    setTimeout(workloop, 0);
    window.requestIdleCallback(workloop);
    // setTimeout(workloop, 0);
    // this.renderImpl(element, this.container);
  }

  renderImpl(element, parent) {
    const {
      type,
      props: { children, ...rest },
    } = element;

    const dom = type === textType ? document.createTextNode('') : document.createElement(type);
    console.log('renderElement', element.props);
    for (const [key, value] of Object.entries(rest)) {
      dom[key] = value;
    }
    for (const child of children) {
      this.renderImpl(child, dom);
    }
    parent.appendChild(dom);
  }
}

function workloop() {
  while(workInProgress) {
    // 处理当前并返回下一个将要处理的fiber节点，并直接赋值给workInProgress
    workInProgress = performUnitOfwork(workInProgress);
  }
}

const performUnitOfwork = (fiber) => {
  /**
   * 1 处理当前fiber :创建dom 设置props 插入当前dom到parent
   * 2 初始化children 的 fiber
   * 3 返回下一个处理的fiber
   */
  // 处理当前fiber :创建dom 设置props 插入当前dom到parent
  // 注意函数式组件并不创建dom
  const isFunctionComponent = fiber.type instanceof Function;
  if(isFunctionComponent) {
    currentHookFiber = fiber;
    currentHookFiber.memorizedState = [];
    currentHookIndex = 0;
    fiber.props.children = [fiber.type(fiber.props)];
  } else {
    const {
      type,
      props: { children, ...rest },
    } = fiber;
    if (!fiber.stateNode) {
      fiber.stateNode =
        type === textType
          ? document.createTextNode('')
          : document.createElement(type);
      console.log('renderElement', fiber.props);
      for (const [key, value] of Object.entries(rest)) {
        fiber.stateNode[key] = value;
      }
    }

    if (fiber.return) {
      // 将创建的 dom 插入parent/ 叔叔
      // 往上查找，直到有一个节点存在 statNode
      let domParentFiber = fiber.return;
      while (!domParentFiber.stateNode) {
        domParentFiber = domParentFiber.return;
      }
      domParentFiber.stateNode.appendChild(fiber.stateNode);
    }
  }


  let preSibling = null;
  // 初始化children 的 fiber
  fiber.props.children.forEach((child, index) => {
    // 初始化新的fiber节点
    const newFiber = {
      type: child.type,
      stateNode: null,
      props: child.props,
      return: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preSibling.sibling = newFiber;
    }
    preSibling = newFiber;
  });

  // 返回下一个处理的fiber
  return getNextFiber(fiber);
};

const getNextFiber = (fiber) => {
  // fiber 遍历顺序：
  // 先遍历child
  // 然后是sibling
  // 最后是return 父节点或兄弟

  if(fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while(nextFiber) {
    if(nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.return;
    }
  }
  return null;
};

function createRoot(container) {
  return new AReactDomRoot(container);
}

function useState(initState) {
  const oldHook = currentHookFiber.alternate?.memorizedState?.[currentHookIndex];
  const hook = {
    // 这就是其跨函数执行保存数据的原理
    state: oldHook ? oldHook.state : initState,
    queue: []
  };
  const actions = oldHook ? oldHook.queue: [];
  const setState = (action) =>{
    hook.queue.push(action);
    // 触发 re-render
    workInProgressRoot.current.alternate = {
      stateNode: workInProgressRoot.current.containerInfo,
      props: workInProgressRoot.current.props,
      alternate: workInProgress.current, // 重要 交换alternate 与 current
    };
    workInProgress = workInProgressRoot.current.alternate;
    setTimeout(workloop, 0);
    window.requestIdleCallback(workloop);
  };
  return [state, setState];
}

function act(callback) {
  // 原理就是不断在空闲时间间歇性检查workInProgress
  // 没有值则说明完成，否则继续检查
  callback();

  return new Promise(resolve => {

    function loop() {
      if (workInProgress) {
        // 存在则下一个空闲任务周期继续检查
        window.requestIdleCallback(loop);
      } else {
        // 不存在则说明已完成，直接resolve
        resolve();
      }
    }
    loop();
  });
}

export default { createElement, createRoot,act, useState };