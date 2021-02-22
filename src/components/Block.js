import {Fragment} from 'react';
import DraggableSvg from './DraggableSvg';

const Block = ({block, onPlace=()=>{}}) => {
  return (<DraggableSvg bounds={block.bounds} viewBounds={block.imageBounds} onPlace={onPlace}>
    <use href="#picture" clipPath={`url(#clip_${block.id})`} />
  </DraggableSvg>)
}

Block.Defs = ({block}) => {
  const {id, Polygon} = block;
  return (
    <Fragment>
      <clipPath id={`clip_${id}`}>
        <Polygon />
      </clipPath>
    </Fragment>
  );
};

export default Block;
