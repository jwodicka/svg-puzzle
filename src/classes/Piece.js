import Point from './Point';

// A Piece is defined by a sequence of Points.
export default class Piece {
  constructor(id, ...points) {
    this.id = id;
    this.i = id; // Used by legacy code
    this.points = points;
    this.edges = new Set();

    this.x = Infinity; // Used by legacy code
    this.y = Infinity; // Used by legacy code
    let xMax = 0;
    let yMax = 0;
    for (const p of points) {
      this.x = Math.min(this.x, p.x);
      this.y = Math.min(this.y, p.y);
      xMax = Math.max(xMax, p.x);
      yMax = Math.max(yMax, p.y);
    }
    this.w = xMax - this.x; // Used by legacy code
    this.h = yMax - this.y; // Used by legacy code

    this.anchor = new Point(this.x, this.y);

    this.relativePoints = points.map((p) => new Point(p.x - this.x, p.y - this.y));
  }

  relativeEdges(point) {
    return this.edges.map((e) => e.relativeTo(point));
  }

  // The Polygon for a given piece is the actual underlying shape before edge effects are applied.
  get Polygon() {
    const points = this.points.map((p) => `${p.x},${p.y}`).join(' ');
    return () => (<polygon points={points} />);
  }
}
