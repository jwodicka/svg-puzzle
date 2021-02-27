export default class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  get points() {
    return [this.a, this.b];
  }

  toString() {
    return `Line[${this.a}-${this.b}]`;
  }

  minus(point) {
    return new Line(this.a.minus(point), this.b.minus(point));
  }

  plus(point) {
    return new Line(this.a.plus(point), this.b.plus(point))
  }

  distance(line) {
    return Math.max(this.a.distance(line.a), this.b.distance(line.b));
  }

  polylineWith(lines) {
    const remaining = [...lines]; // remaining will be mutated as we work.
    const result = [];
    for (let current = this.a; remaining.length > 0; ) {
      result.push(current);
      const i = remaining.findIndex((l) => l.a ===  current || l.b === current);
      const [next] = remaining.splice(i, 1);
      current = (current === next.a) ? next.b : next.a;
    }
    result.push(this.b);
    return result;
  }

  polygonWith(lines) {
    return Polygon.fromUnorderedLines(this, ...lines);
  }
}

class Polyline {
  static fromLine(line) {
    return new Polyline(...line.points)
  }

  static fromUnorderedLines(...lines) {
    const openSegments = [...lines];
    const closedSegments = [];
    while (openSegments.length > 0) {
      const segment = openSegments.pop();
      // Matches are segments we could use to extend from segment.b.
      const matches = openSegments.filter(s => s.a === segment.b || s.b === segment.b);
      if (matches.length === 0) {
        throw new Error(`Couldn't extend from ${segment}. ${openSegments.length} open segments left: ${openSegments.map(s => s.toString()).join(', ')}`);
      }
      // Remove the first match from openSegments.
      const [match] = openSegments.splice(openSegments.indexOf(matches[0]), 1);
      const newSegment = Polyline.fromLine(segment).extend(match);
      if (newSegment.isClosed) {
        closedSegments.push(newSegment);
      } else {
        openSegments.push(newSegment);
      }
    }
    return closedSegments;
  }

  constructor(...points) {
    this.points = points;
  }

  get a() {
    return this.points[0];
  }
  get b() {
    return this.points[this.points.length - 1];
  }
  get isClosed() {
    return this.a === this.b;
  }
  get path() {
    const [start, ...rest] = this.points;
    return `M ${start.x},${start.y} L ${rest.map(p => `${p.x},${p.y}`).join(' ')}`;
  }
  // get isClockwise() {
  //   return this.signedArea > 0;
  // }
  // get signedArea() {
  //   return this.points.reduce((s, p, i, a) => {
  //     const pN = a[(i+1) % a.length];
  //     return s + (pN.x - p.x) * (pN.y + p.Y);
  //   }, 0);
  // }

  toString() {
    return `Polyline[${this.points.map(p => p.toString()).join('-')}]`;
  }

  extend(line) {
    // To extend this polyline, one of its endpoints must match an endpoint of the extending line.
    if (this.a === line.a) {
      return new Polyline(...this.points.reverse(), ...line.points.slice(1));
    } else if (this.a === line.b) {
      return new Polyline(...this.points.reverse(), ...line.points.reverse().slice(1));
    } else if (this.b === line.a) {
      return new Polyline(...this.points, ...line.points.slice(1));
    } else if (this.b === line.b) {
      return new Polyline(...this.points, ...line.points.reverse().slice(1));
    } else {
      throw new Error("Can't extend a line with a line that isn't adjoining.");
    }
  }
}

class Polygon {
  static fromUnorderedLines(...lines) {
    const polylines = Polyline.fromUnorderedLines(...lines);
    return new Polygon(...polylines);
  }

  constructor(...polylines) {
    for (const line of polylines) {
      if (!(line.isClosed)) {
        throw new Error("Can't create a polygon from an unclosed polyline. " + line.toString() + ' ' + line.isClosed);
      }
    }
    this.polylines = polylines;
  }

  get isSolid() {
    return this.polylines.length === 1;
  }

  get path() {
    return this.polylines.map(p => p.path).join(' ');
  }

  Component() {
    const path = this.path;
    // console.log(path);
    return () => (<path d={path} />)
  }
}
