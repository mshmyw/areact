import { describe, it, expect } from "vitest";
import AReact from './AReact';
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