export default class Point {
  static fromDOMPoint(domPoint) {
    return new Point(domPoint.x, domPoint.y);
  }

  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }

  get DOMPoint() {
    return new DOMPointReadOnly(this._x, this._y);
  }

  toSVGSpace(svg) {
    return Point.fromDOMPoint(this.DOMPoint.matrixTransform(svg.getScreenCTM().inverse()));
  }

  toString() {
    return `(${this._x.toFixed(0)},${this._y.toFixed(0)})`;
  }

  add(p) {
    return new Point(this._x + p.x, this._y + p.y)
  }
  plus(p) {
    return new Point(this._x + p.x, this._y + p.y)
  }
  minus(p) {
    return new Point(this._x - p.x, this._y - p.y);
  }
  distance (p) {
    return Math.sqrt(Math.pow(this._x - p.x, 2) + Math.pow(this._y - p.y, 2));
  }
}
