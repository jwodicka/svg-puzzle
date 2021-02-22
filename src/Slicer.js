import Edge from './classes/Edge';
import Piece from './classes/Piece';
import Point from './classes/Point';

/*
A slicer is an image-agnostic tool for dividing a rectangular* area into a collection of
non-overlapping polygons that completely cover the original area.

* In principle, we could run a slicer on any defined shape, but for now: rectangles.

All slicers return a collection of Pieces and a collection of Edges.
*/

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

      rank.push(new Point(baseX, baseY));
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
      const aName = point.toString();
      const bName = prevPoint.toString();
      if (aName in edges && bName in edges[aName]) {
        edges[aName][bName].linkPiece(piece);
      } else {
        if (!(aName in edges)) {
          edges[aName] = {};
        }
        if (!(bName in edges)) {
          edges[bName] = {};
        }
        edges[aName][bName] = Edge.fromPoints(point, prevPoint);
        edges[bName][aName] = edges[aName][bName];
        edges[aName][bName].linkPiece(piece);
      }
      prevPoint = point;
    }
  }

  return {pieces, edges};
}