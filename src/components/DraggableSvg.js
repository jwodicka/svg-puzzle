import {useEffect, useRef, useState} from 'react';
import {DraggableCore} from 'react-draggable';

function DraggableSvg({x, y, w, h, children}) {
  const svgRef = useRef(null);
  const [pos, setPos] = useState({x: x, y: y});
  useEffect(() => {
    setPos({x: x, y: y})
  }, [x, y]);

  // Offset is only relevant while dragging, and holds the offset from the point clicked
  // to the anchor for this block.
  const [offset, setOffset] = useState({x: 0, y: 0});

  // Takes a point as coordinates in screen-space and returns the SVGPoint
  // of the same coordinates in SVG-space
  const getSVGPoint = (svg, x, y) => {
    const point = DOMPointReadOnly.fromPoint({x, y});
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  const onStart = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    const point = getSVGPoint(svg, x, y);
    setOffset({x: pos.x - point.x, y: pos.y - point.y});
  }

  const onDrag = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    const point = getSVGPoint(svg, x, y);
    setPos({x: point.x + offset.x, y: point.y + offset.y});
  }

  const onStop = (e, {node, x, y}) => {
    const svg = node.farthestViewportElement
    const point = getSVGPoint(svg, x, y);
    setPos({x: point.x + offset.x, y: point.y + offset.y});
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