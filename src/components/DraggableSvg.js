import {useEffect, useRef, useState} from 'react';
import {DraggableCore} from 'react-draggable';
import Point from '../classes/Point';

function DraggableSvg({x, y, w, h, onPlace=()=>{}, children}) {
  const svgRef = useRef(null);
  const [pos, setPos] = useState(new Point(x, y));
  useEffect(() => setPos(new Point(x, y)), [x, y]);

  // Offset is only relevant while dragging, and holds the offset from the point clicked
  // to the anchor for this block.
  const [offset, setOffset] = useState({x: 0, y: 0});

  // Takes a point as coordinates in screen-space and returns the Point
  // of the same coordinates in SVG-space
  const getSVGPoint = (svg, x, y) => {
    const point = new Point(x, y).DOMPoint;
    return Point.fromDOMPoint(point.matrixTransform(svg.getScreenCTM().inverse()));
  }

  // Performs getSVGPoint, then applies any stored offset.
  const getOffsetPoint = (svg, x, y) => {
    const point = getSVGPoint(svg, x, y);
    return new Point(point.x + offset.x, point.y + offset.y);
  }

  const onStart = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    const point = getSVGPoint(svg, x, y);
    setOffset({x: pos.x - point.x, y: pos.y - point.y});
  }

  const onDrag = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    setPos(getOffsetPoint(svg, x, y));
  }

  const onStop = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    const offsetPoint = getOffsetPoint(svg, x, y)
    setPos(offsetPoint);
    onPlace(offsetPoint);
  }

  return (
    <DraggableCore nodeRef={svgRef} onStart={onStart} onDrag={onDrag} onStop={onStop}>
      <svg ref={svgRef} x={pos.x} y={pos.y} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {children}
      </svg>
    </DraggableCore>
  );
}

export default DraggableSvg;