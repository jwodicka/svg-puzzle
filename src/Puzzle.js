import './Puzzle.css';

import {useEffect, useState} from 'react';
import {gridSlicer} from './Slicer';
import Point from './classes/Point';
import Block from './components/Block';

/*
A Piece is defined by a set of edges that form a closed polygon somewhere in
image-space.

A Block is an entity on the board that represents one or more connected pieces.
A Block has a position and rotation.
The position of a Block is calculated from the center of the Block's bounding-box.

At the start of the puzzle, one Block is generated per Piece.

When two Blocks are placed correctly relative to each other, they will be replaced by
one Block encompassing all of the Pieces from both.

When only one Block exists, the puzzle is solved.
*/

const addPoints = (a, b) => new Point(a.x + b.x, a.y + b.y);
const setIntersection = (setA, setB) => {
  let _intersection = new Set()
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem)
      }
  }
  return _intersection
}
const edgeName = ([a, b]) => `${a}-${b}`

const pointDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

function Puzzle({picture, pictureDimensions, pieceDimensions}) {
  const pieceSize = {
    w: pictureDimensions.w / pieceDimensions.w,
    h: pictureDimensions.h / pieceDimensions.h,
  }
  const viewW = pictureDimensions.w * 2
  const viewH = pictureDimensions.h * 2;

  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    const {pieces} = gridSlicer({pixelDimensions: pictureDimensions, pieceCount: pieceDimensions});
    setPieces(pieces);
  }, [
    // Recalculate pieces only when the actual widths or heights change.
    pictureDimensions.w, pictureDimensions.h,
    pieceDimensions.w, pieceDimensions.h
  ]);
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    const borderSize = {
      w: pieceSize.w / 4,
      h: pieceSize.h / 4,
    }
    const gutterSize = {
      w: (pictureDimensions.w - (borderSize.w * 2)) / (pieceDimensions.w - 1),
      h: (pictureDimensions.h - (borderSize.h * 2)) / (pieceDimensions.h - 1),
    } 
    const newBlocks = pieces.map((piece) => {
      const {x, y} = piece;
      const initialX = x + borderSize.w + ((x / pieceSize.w) * gutterSize.w);
      const initialY = y + borderSize.h + ((y / pieceSize.h) * gutterSize.h);
      return new RenderableBlock(piece, initialX, initialY)
    });
    setBlocks(newBlocks);
  }, [
    // Reposition pieces only when they are regenerated.
    pieces,
  ]);

  // When a block is placed (i.e., when the drag ends), this method will
  // be invoked. Update the canonical X and Y of the block, and eventually
  // perform collision-detection to see if we can merge with another block.
  const onPlace = (block) => (point) => {
    console.log(`Block ${block.id} placed at ${point}`);

    const blockAnchor = block.piece.anchor;

    // TODO: We currently iterate all blocks to find the ones with matching edges. We could probably
    //       look them up more directly if this is an efficiency issue.
    const neighbors = blocks.filter((b) => setIntersection(b.piece.edges, block.piece.edges).size > 0 && b !== block)

    for (const edge of block.piece.edges) {
      const sharedNeighbors = neighbors.filter((b) => b.piece.edges.has(edge));
      if (sharedNeighbors.length !== 1) {
        continue;
      }
      const [neighbor] = sharedNeighbors;
      // relativeEdge is the offset of this edge's coordinate-pair relative to the block's anchor
      const relativeEdge = edge.relativeTo(blockAnchor);
      // currentEdge is the computed position of this edge in image-space after the drop.
      const currentEdge = [relativeEdge[0].add(point), relativeEdge[1].add(point)];
      
      const neighborRelativeEdge = edge.relativeTo(neighbor.piece.anchor);
      const neighborCurrentEdge = [
        addPoints(neighborRelativeEdge[0], neighbor.anchor),
        addPoints(neighborRelativeEdge[1], neighbor.anchor)
      ]
      
      console.log(edgeName(currentEdge));
      console.log(edgeName(neighborCurrentEdge));
      console.log(pointDistance(currentEdge[0], neighborCurrentEdge[0]), pointDistance(currentEdge[1], neighborCurrentEdge[1]));
    }

    setBlocks(blocks.map((b) => {
      if (b.id === block.id) {
        return new RenderableBlock(block.piece, point.x, point.y);
      }
      return b
    }));
  }

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`}>
      <defs>
        <image id="picture"
          width={pictureDimensions.w} height={pictureDimensions.h} 
          href={picture} />
        {blocks.map((block) => <Block.Defs key={block.id} block={block}/>)}
      </defs>

      <rect x={0} y={0} width={viewW} height={viewH} className="background"/>
      <rect x={viewW / 4} y={viewH / 4} width={pictureDimensions.w} height={pictureDimensions.h} className="board" />

      {blocks.map(
        (block) => <Block key={block.id} block={block} onPlace={onPlace(block)}/>
      )}
    </svg>
  );
}

class RenderableBlock {
  constructor(piece, initialX, initialY) {
    this.id = piece.id;
    this.piece = piece;
    this.x = initialX;
    this.y = initialY;
    this.anchor = new DOMPointReadOnly(initialX, initialY);
  }
}

export default Puzzle;
