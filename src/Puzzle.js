import './Puzzle.css';

import {useEffect, useState} from 'react';
import {gridSlicer} from './Slicer';
import Block from './components/Block';
import RenderableBlock from './classes/Block';
import Point from './classes/Point';

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

const setIntersection = (setA, setB) => {
  let _intersection = new Set()
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem)
      }
  }
  return _intersection
}

const shuffle = (original) => {
  const array = [...original];
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const distributeBlocks = (blocks, positions) =>
  shuffle(blocks).map((block) => block.moveTo(positions.pop()));

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

  // Generate blocks from the pieces and shuffle them across the grid.
  useEffect(() => {
    const borderSize = {
      w: pieceSize.w / 4,
      h: pieceSize.h / 4,
    }
    const gutterSize = {
      w: (pictureDimensions.w - (borderSize.w * 2)) / (pieceDimensions.w - 1),
      h: (pictureDimensions.h - (borderSize.h * 2)) / (pieceDimensions.h - 1),
    }

    const positions = [];
    for (let x = 0; x < pieceDimensions.w; x++) {
      for (let y = 0; y < pieceDimensions.h; y++) {
        positions.push(new Point(
          borderSize.w + x * (pieceSize.w + gutterSize.w),
          borderSize.h + y * (pieceSize.h + gutterSize.h),
        ));
      }
    }

    const blocks = RenderableBlock.fromPieces(pieces);
    setBlocks(distributeBlocks(blocks, positions));
  }, [pieces]);

  // When a block is placed (i.e., when the drag ends), this method will
  // be invoked. Update the canonical X and Y of the block, and eventually
  // perform collision-detection to see if we can merge with another block.
  const onPlace = (block) => (point) => {
    console.log(`Block ${block.id} placed at ${point}`);

    const blockAnchor = block.imageBounds.anchor;

    // TODO: We currently iterate all blocks to find the ones with matching edges. We could probably
    //       look them up more directly if this is an efficiency issue.
    const neighbors = blocks.filter((b) => setIntersection(b.edges, block.edges).size > 0 && b !== block)

    for (const edge of block.edges) {
      const sharedNeighbors = neighbors.filter((b) => b.edges.has(edge));
      // If this edge has no neighbor, we're done.
      if (sharedNeighbors.length !== 1) {
        continue;
      }
      const [neighbor] = sharedNeighbors;
      // relativeEdge is the offset of this edge's coordinate-pair relative to the block's anchor
      const relativeEdge = edge.relativeTo(blockAnchor);
      // currentEdge is the computed position of this edge in image-space after the drop.
      const currentEdge = relativeEdge.plus(point);
      
      const neighborRelativeEdge = edge.relativeTo(neighbor.imageBounds.anchor);
      const neighborCurrentEdge = neighborRelativeEdge.plus(neighbor.anchor);
      
      console.log(currentEdge);
      console.log(neighborCurrentEdge);
      console.log(currentEdge.distance(neighborCurrentEdge));
    }

    setBlocks(blocks.map((b) => {
      if (b.id === block.id) {
        return block.moveTo(point);
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

export default Puzzle;
