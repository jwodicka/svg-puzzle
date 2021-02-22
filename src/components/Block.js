import {Fragment} from 'react';
import DraggableSvg from './DraggableSvg';

const Block = ({block, onPlace=()=>{}}) => {
  return (<DraggableSvg bounds={block.bounds} onPlace={onPlace}>
    <use href={`#block_${block.id}`} x="0" y="0" />
  </DraggableSvg>)
}

Block.Defs = ({block}) => {
  const id = block.id;
  const {bounds, Polygon} = block.piece;
  return (
    <Fragment>
      <clipPath id={`clip_${id}`}>
        <Polygon />
      </clipPath>
      <symbol id={`block_${id}`}
        viewBox={bounds.viewBox}
        width={bounds.width} height={bounds.height}
        clipPath={`url(#clip_${id})`}
      >
        <use href="#picture" />
      </symbol>
    </Fragment>
  );
};

export default Block;
