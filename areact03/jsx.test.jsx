import { describe, it, expect } from "vitest";
import AReact from './AReact';
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
describe('AReact jsx', () => {
  it('should render jsx', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
      );
  });

  it('should render jsx with text', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar">hello</div>
        <button>add</button>
      </div>
    );
    console.log(JSON.stringify(element, null, 4));
    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">hello</div><button>add</button></div>'
    );
  });

  it('should render jsx with diffrent props', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className='bar'>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  });
});

// 该测试集对异步模式进行测试
describe('AReact concurrent', () => {
  // only 仅执行当前测试用例
  it.only('should render in async ', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe('');
    await sleep(1000);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });
});