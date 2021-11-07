export default class Polyline {
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
