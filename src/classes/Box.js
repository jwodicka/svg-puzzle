import Point from "./Point";

export default class Box {
  static fromPoints(points) {
    let x = Infinity;
    let y = Infinity;
    let xMax = 0;
    let yMax = 0;
    for (const p of points) {
      x = Math.min(x, p.x);
      y = Math.min(y, p.y);
      xMax = Math.max(xMax, p.x);
      yMax = Math.max(yMax, p.y);
    }
    const w = xMax - x; // Used by legacy code
    const h = yMax - y; // Used by legacy code
    return new Box(new Point(x, y), w, h);
  }

  constructor(anchor, width, height) {
    this.anchor = anchor;
    this.width = width;
    this.height = height;
  }

  get viewBox() {
    return `${this.anchor.x} ${this.anchor.y} ${this.width} ${this.height}`
  }

  anchorAt(position) {
    return new Box(position, this.width, this.height);
  }
}