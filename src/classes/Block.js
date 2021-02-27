import Box from "./Box";

const setDisjunction = (setA, setB) => {
  let _difference = new Set(setA)
    for (let elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem)
        } else {
            _difference.add(elem)
        }
    }
    return _difference
}

export default class Block {
  static fromPiece(piece) {
    return new Block(piece.id, [piece], piece.anchor);
  }

  constructor(id, pieces, position) {
    this.id = id;
    this._pieces = pieces;
    this.anchor = position;
  }

  get edges() {
    return this._pieces.reduce((a, p) => setDisjunction(p.edges, a), new Set());
  }

  get bounds() {
    return this.imageBounds.anchorAt(this.anchor);
  }

  get imageBounds() {
    return Box.fromBoxes(this._pieces.map(p => p.bounds));
  }

  get Polygon() {
    const [line, ...lines] = [...this.edges].map(e => e.line);
    const polygon = line.polygonWith(lines);
    return () => (<path d={polygon.path} fillRule="evenodd" />);
  }

  moveTo(position) {
    return new Block(this.id, this._pieces, position);
  }

  sharesPiecesWith(that) {
    return new Set([...this._pieces, ...that._pieces]).size < this._pieces.length + that._pieces.length
  }

  mergeWith(that) {
    const [id] = [this.id, that.id].sort();
    const pieces = [...this._pieces, ...that._pieces];
    const position = Box.fromBoxes([this.bounds, that.bounds]).anchor;
    return new Block(id, pieces, position);
  }
}
