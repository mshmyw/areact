import { describe, it, expect } from "vitest";
import AReact from './AReact';
describe('AReact jsx', () => {
  it('should render jsx', () => {
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
  });
});