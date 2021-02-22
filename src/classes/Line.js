export default class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  toString() {
    return `Line[${this.a}-${this.b}]`;
  }

  minus(point) {
    return new Line(this.a.minus(point), this.b.minus(point));
  }

  plus(point) {
    return new Line(this.a.plus(point), this.b.plus(point))
  }

  distance(line) {
    return Math.max(this.a.distance(line.a), this.b.distance(line.b));
  }
}
