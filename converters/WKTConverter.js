'use strict';

const WKTConverter = {

  convertPolygon(polygon) {
    let points = [];
    polygon.coordinates[0].map(coor => {
      points.push(coor.join(' '));
    });
    return `POLYGON ((${points.join(',')}))`;
  }
};

export default WKTConverter;
