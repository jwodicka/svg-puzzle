import './Puzzle.css';

import {useEffect, useState} from 'react';
import DraggableSvg from './components/DraggableSvg';

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

const buildPieces = (pixelsWide, pixelsHigh, piecesWide, piecesHigh) => {
  const pieceWidth = pixelsWide / piecesWide;
  const pieceHeight = pixelsHigh / piecesHigh;

  const rects = [];
  const points = [];

  for (let x = 0; x <= piecesWide; x += 1) {
    const rank = [];
    for (let y = 0; y <= piecesHigh; y += 1) {
      rank.push(new DOMPointReadOnly(x * pieceWidth, y * pieceHeight));
    }
    points.push(rank);
  }

  for (let x = 0; x < piecesWide; x += 1) {
    for (let y = 0; y < piecesHigh; y += 1) {
      rects.push({
        i: rects.length,
        x: x * pieceWidth,
        y: y * pieceHeight,
        w: pieceWidth,
        h: pieceHeight,
        points: [
          points[x][y], points[x+1][y], points[x+1][y+1], points[x][y+1]
        ],
      });
    }
  }

  return rects;
}

function Puzzle({picture, pictureDimensions, pieceDimensions}) {
  const pieceSize = {
    w: pictureDimensions.w / pieceDimensions.w,
    h: pictureDimensions.h / pieceDimensions.h,
  }
  const viewW = pictureDimensions.w * 2
  const viewH = pictureDimensions.h * 2;

  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    setPieces(buildPieces(pictureDimensions.w, pictureDimensions.h, pieceDimensions.w, pieceDimensions.h));
  }, [pictureDimensions.w, pictureDimensions.h, pieceDimensions.w, pieceDimensions.h])
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
      const {i, x, y, w, h} = piece;
      const block = {
        i, w, h,
        x: x + borderSize.w + ((x / pieceSize.w) * gutterSize.w),
        y: y + borderSize.h + ((y / pieceSize.h) * gutterSize.h),
        piece,
      }
      return block;
    });
    setBlocks(newBlocks);
  }, [pieces, pieceSize.w, pieceSize.h, pictureDimensions, pieceDimensions.w, pieceDimensions.h])

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`}>
      <defs>
        <image id="picture"
          width={pictureDimensions.w} height={pictureDimensions.h} 
          href={picture} />
        {blocks.map(({i, piece:{x, y, w, h}}) => (
          <symbol id={`block_${i}`} key={`block_${i}`}
            viewBox={`${x} ${y} ${w} ${h}`}
            width={pieceSize.w} height={pieceSize.h}
          >
            <use href="#picture" />
          </symbol>
        ))}
      </defs>

      <rect x={0} y={0} width={viewW} height={viewH} className="background"/>
      <rect x={viewW / 4} y={viewH / 4} width={pictureDimensions.w} height={pictureDimensions.h} className="board"/>

      {blocks.map((block => <Block key={block.i} {...block} />))}
    </svg>
  );
}

function Block({i, x, y, w, h}) {
  return (
    <DraggableSvg x={x} y={y} w={w} h={h}>
      <rect x="0" y="0" width={w} height={h} className="piece" />
      <use href={`#block_${i}`} x="0" y="0" />
    </DraggableSvg>
  );
}

export default Puzzle;
