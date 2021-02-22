/*
A slicer is an image-agnostic tool for dividing a rectangular* area into a collection of
non-overlapping polygons that completely cover the original area.

* In principle, we could run a slicer on any defined shape, but for now: rectangles.

All slicers return a collection of Pieces and a collection of Edges.
*/

// A Point, for our purposes, is a DomPointReadOnly.

// ASSUMPTION: We're never doing slicing that's finer than one pixel in image-space,
//             so we can truncate coordinates to their whole component.
const pointName = (point) => `(${point.x.toFixed(0)},${point.y.toFixed(0)})`

class Edge {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.pieces = new Set();
  }

  relativeTo(point) {
    return [
      new DOMPointReadOnly(this.pointA.x - point.x, this.pointA.y - point.y),
      new DOMPointReadOnly(this.pointB.x - point.x, this.pointB.y - point.y),
    ]
  }

  linkPiece(piece) {
    this.pieces.add(piece);
    piece.edges.add(this);
  }

  toString() {
    return `Edge[${pointName(this.pointA)}-${pointName(this.pointB)}]`
  }
}

// A Piece is defined by a sequence of Points.
class Piece {
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

    this.anchor = new DOMPointReadOnly(this.x, this.y);

    this.relativePoints = points.map((p) => new DOMPointReadOnly(p.x - this.x, p.y - this.y));
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

      // If we want to perturb points, we can do so here before we build polygons out of them.
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
    const points = piece.points;
    let prevPoint = points[points.length - 1];
    for (const point of points) {
      const aName = pointName(point);
      const bName = pointName(prevPoint);
      if (aName in edges && bName in edges[aName]) {
        edges[aName][bName].linkPiece(piece);
      } else {
        if (!(aName in edges)) {
          edges[aName] = {};
        }
        if (!(bName in edges)) {
          edges[bName] = {};
        }
        edges[aName][bName] = new Edge(point, prevPoint);
        edges[bName][aName] = edges[aName][bName];
        edges[aName][bName].linkPiece(piece);
      }
      prevPoint = point;
    }
  }

  return {pieces, edges};
}