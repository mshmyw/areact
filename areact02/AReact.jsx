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

class AReactDomRoot {
  constructor(container) {
    this.container = container;
  }
  render(element) {
    this.renderImpl(element, this.container);
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
function createRoot(container) {
  return new AReactDomRoot(container);
}
export default { createElement, createRoot };