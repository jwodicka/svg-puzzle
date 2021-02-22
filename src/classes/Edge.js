import Point from './Point';

export default class Edge {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.pieces = new Set();
  }

  relativeTo(point) {
    return [
      new Point(this.pointA.x - point.x, this.pointA.y - point.y),
      new Point(this.pointB.x - point.x, this.pointB.y - point.y),
    ]
  }

  linkPiece(piece) {
    this.pieces.add(piece);
    piece.edges.add(this);
  }

  toString() {
    return `Edge[${this.pointA}-${this.pointB}]`;
  }
}
