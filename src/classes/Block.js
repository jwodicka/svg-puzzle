export default class Block {
  static fromPieces(pieces) {
    return pieces.map((p) => new Block(p, p.anchor));
  }

  constructor(piece, position) {
    this.id = piece.id;
    this._piece = piece;
    this.anchor = position;
    this.bounds = piece.bounds.anchorAt(position);
  }

  get edges() {
    return this._piece.edges;
  }

  get imageBounds() {
    return this._piece.bounds;
  }

  get Polygon() {
    return this._piece.Polygon;
  }

  moveTo(position) {
    return new Block(this._piece, position);
  }
}
