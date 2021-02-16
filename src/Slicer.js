/*
A slicer is an image-agnostic tool for dividing a rectangular* area into a collection of
non-overlapping polygons that completely cover the original area.

* In principle, we could run a slicer on any defined shape, but for now: rectangles.

All slicers return a collection of Pieces and a collection of Edges.
*/

// A Point, for our purposes, is a DomPointReadOnly.

class Edge {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.pieces = [];
  }
}

// A Piece is defined by a sequence of Points.
class Piece {
  constructor(id, ...points) {
    this.id = id;
    this.i = id; // Used by legacy code
    this.points = points;

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
  }

  get Polygon() {
    const points = this.points.map((p) => `${p.x},${p.y}`).join(' ');
    return () => (<polygon points={points} />);
  }
}

export const gridSlicer = ({pixelDimensions, pieceCount}) => {
  const pieceSize = {
    w: pixelDimensions.w / pieceCount.w,
    h: pixelDimensions.h / pieceCount.h,
  }

  const points = [];
  for (let x = 0; x <= pieceCount.w; x += 1) {
    const rank = [];
    for (let y = 0; y <= pieceCount.h; y += 1) {
      let baseX = x * pieceSize.w;
      let baseY = y * pieceSize.h;
      if (x > 0 && x < pieceCount.w) {
        baseX = baseX + ((Math.random() * 2) -1) * (pieceSize.w / 10)
      }
      if (y > 0 && y < pieceCount.h) {
        baseY = baseY + ((Math.random() * 2) -1) * (pieceSize.h / 10)
      }

      rank.push(new DOMPointReadOnly(baseX, baseY));
    }
    points.push(rank);
  }

  // If we want to perturb points, we can do so here before we build polygons out of them.

  const pieces = [];
  for (let x = 0; x < pieceCount.w; x += 1) {
    for (let y = 0; y < pieceCount.h; y += 1) {
      pieces.push(
        new Piece(`${x},${y}`, points[x][y], points[x+1][y], points[x+1][y+1], points[x][y+1])
      );
    }
  }

  const edges = {};
  for (const piece of pieces) {
    console.log(piece);
  }

  return {pieces, edges};
}