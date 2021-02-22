import {Fragment} from 'react';
import DraggableSvg from './DraggableSvg';

const Block = ({block, onPlace=()=>{}}) => {
  return (<DraggableSvg bounds={block.bounds} onPlace={onPlace}>
    <use href={`#block_${block.id}`} x="0" y="0" />
  </DraggableSvg>)
}

Block.Defs = ({block}) => {
  const {id, imageBounds, Polygon} = block;
  return (
    <Fragment>
      <clipPath id={`clip_${id}`}>
        <Polygon />
      </clipPath>
      <symbol id={`block_${id}`}
        viewBox={imageBounds.viewBox}
        width={imageBounds.width} height={imageBounds.height}
        clipPath={`url(#clip_${id})`}
      >
        <use href="#picture" />
      </symbol>
    </Fragment>
  );
};

export default Block;
