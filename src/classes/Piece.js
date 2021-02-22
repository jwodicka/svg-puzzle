import Box from './Box';

// A Piece is defined by a sequence of Points.
export default class Piece {
  constructor(id, ...points) {
    this.id = id;
    this.i = id; // Used by legacy code
    this.points = points;
    this.edges = new Set();

    this.bounds = Box.fromPoints(points);

    // this.relativePoints = points.map((p) => new Point(p.x - this.x, p.y - this.y));
  }

  get anchor() {
    return this.bounds.anchor;
  }
  get width() {
    return this.bounds.width;
  }
  get height() {
    return this.bounds.height;
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
