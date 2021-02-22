export default class Block {
  static fromPieces(pieces) {
    return pieces.map((p) => new Block(p, p.anchor));
  }

  constructor(piece, position) {
    this.id = piece.id;
    this.piece = piece;
    this.anchor = position;
    this.bounds = piece.bounds.anchorAt(position);
  }

  moveTo(position) {
    return new Block(this.piece, position);
  }
}
