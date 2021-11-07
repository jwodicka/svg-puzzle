import Polygon from "./Polygon";

export default class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  get points() {
    return [this.a, this.b];
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

  polylineWith(lines) {
    const remaining = [...lines]; // remaining will be mutated as we work.
    const result = [];
    for (let current = this.a; remaining.length > 0; ) {
      result.push(current);
      const i = remaining.findIndex((l) => l.a ===  current || l.b === current);
      const [next] = remaining.splice(i, 1);
      current = (current === next.a) ? next.b : next.a;
    }
    result.push(this.b);
    return result;
  }

  polygonWith(lines) {
    return Polygon.fromUnorderedLines(this, ...lines);
  }
}
