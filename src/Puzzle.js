import './Puzzle.css';

import {useEffect, useState, Fragment} from 'react';
import DraggableSvg from './components/DraggableSvg';
import {gridSlicer} from './Slicer';

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
    // setPieces(buildPieces(pictureDimensions.w, pictureDimensions.h, pieceDimensions.w, pieceDimensions.h));
  }, [pictureDimensions, pieceDimensions])
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
        {blocks.map(({i, piece}) => {
          const {x, y, w, h} = piece;
          const Polygon = piece.Polygon;
          return (
            <Fragment key={`${i}`}>
              <clipPath id={`clip_${i}`}>
                <Polygon />
              </clipPath>
              <symbol id={`block_${i}`}
                viewBox={`${x} ${y} ${w} ${h}`}
                width={pieceSize.w} height={pieceSize.h}
                clipPath={`url(#clip_${i})`}
              >
                <use href="#picture" />
              </symbol>
            </Fragment>
          );
        })}
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
      <use href={`#block_${i}`} x="0" y="0" />
    </DraggableSvg>
  );
}

export default Puzzle;
