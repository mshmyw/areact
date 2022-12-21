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
      children: children.map(child => {
        return typeof child !== 'object' ? createTextElement(child): child;
      })
     }
  };
}

// 当前执行的任务
let workInProgress = null;
let workInProgressRoot = null; // 保存整个fiberroot
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
    fiber.return.stateNode.appendChild(fiber.stateNode);
  }

  let preSibling = null;
  // 初始化children 的 fiber
  children.forEach((child, index) => {
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
export default { createElement, createRoot };