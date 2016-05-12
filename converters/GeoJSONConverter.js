'use strict'

const GeoJSONConverter = {

  convertPolygon(polygon) {
    let newPolygon = [];
    if (polygon.indexOf('POLYGON') !== -1) {
      polygon
        .replace('POLYGON ((', '')
        .replace('POLYGON((', '')
        .replace('))', '')
        .split(',')
        .map(coor => {
          coor = coor.trim().split(' ');
          newPolygon.push([parseFloat(coor[0]), parseFloat(coor[1])]);
        });
    } else {
      polygon
        .split(' ')
        .map(point => {
          if (newPolygon.length === 0) {
            newPolygon.push([parseFloat(point)]);
          } else {
            if (newPolygon[newPolygon.length - 1].length === 2) {
              newPolygon.push([parseFloat(point)]);
            } else {
              newPolygon[newPolygon.length -1].push(parseFloat(point));
            }
          }
        });      
    }
    return {
      type: 'Polygon',
      coordinates: [newPolygon]
    }
  }
};

export default GeoJSONConverter;
