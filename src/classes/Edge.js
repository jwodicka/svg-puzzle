import Line from './Line';

export default class Edge {
  static fromPoints(a, b) {
    return new Edge(new Line(a, b));
  }

  constructor(line) {
    this.line = line;
    this.pieces = new Set();
  }

  relativeTo(point) {
    return this.line.minus(point);
  }

  linkPiece(piece) {
    this.pieces.add(piece);
    piece.edges.add(this);
  }

  toString() {
    return `Edge[${this.line.a}-${this.line.b}]`;
  }
}
