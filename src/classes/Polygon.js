import Polyline from './Polyline';

export default class Polygon {
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
