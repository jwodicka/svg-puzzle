export default class Block {
  static fromPieces(pieces) {
    return pieces.map((p) => new Block(p, p.anchor));
  }

  constructor(piece, position) {
    this.id = piece.id;
    this.piece = piece;
    this.x = position.x;
    this.y = position.y;
    this.anchor = position;
  }

  moveTo(position) {
    return new Block(this.piece, position);
  }
}

