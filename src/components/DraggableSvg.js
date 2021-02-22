import {useEffect, useRef, useState} from 'react';
import {DraggableCore} from 'react-draggable';
import Point from '../classes/Point';

function DraggableSvg({bounds, viewBounds, onPlace=()=>{}, children}) {
  const svgRef = useRef(null);
  const [pos, setPos] = useState(bounds.anchor);
  useEffect(() => setPos(bounds.anchor), [bounds.anchor]);

  // Offset is only relevant while dragging, and holds the offset from the point clicked
  // to the anchor for this block.
  const [offset, setOffset] = useState(new Point(0, 0));

  // Performs getSVGPoint, then applies any stored offset.
  const getOffsetPoint = (svg, x, y) => new Point(x, y).toSVGSpace(svg).plus(offset);

  const onStart = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement;
    const point = new Point(x, y).toSVGSpace(svg);
    setOffset(pos.minus(point));
  }

  const onDrag = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement;
    setPos(getOffsetPoint(svg, x, y));
  }

  const onStop = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement;
    const offsetPoint = getOffsetPoint(svg, x, y);
    setPos(offsetPoint);
    onPlace(offsetPoint);
  }

  return (
    <DraggableCore nodeRef={svgRef} onStart={onStart} onDrag={onDrag} onStop={onStop}>
      <svg ref={svgRef}
        x={pos.x} y={pos.y}
        width={bounds.width} height={bounds.height} 
        viewBox={viewBounds.viewBox}
      >
        {children}
      </svg>
    </DraggableCore>
  );
}

export default DraggableSvg;
