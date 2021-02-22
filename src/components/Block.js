import {Fragment} from 'react';
import DraggableSvg from './DraggableSvg';

const Block = ({block, onPlace=()=>{}}) => {
  return (<DraggableSvg x={block.x} y={block.y} w={block.piece.w} h={block.piece.h} onPlace={onPlace}>
    <use href={`#block_${block.id}`} x="0" y="0" />
  </DraggableSvg>)
}

Block.Defs = ({block}) => {
  const id = block.id;
  const {x, y, w, h} = block.piece;
  const Polygon = block.piece.Polygon;
  return (
    <Fragment>
      <clipPath id={`clip_${id}`}>
        <Polygon />
      </clipPath>
      <symbol id={`block_${id}`}
        viewBox={`${x} ${y} ${w} ${h}`}
        width={w} height={h}
        clipPath={`url(#clip_${id})`}
      >
        <use href="#picture" />
      </symbol>
    </Fragment>
  );
};

export default Block;
