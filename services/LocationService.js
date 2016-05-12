'use strict';

import { locations } from '../config';

const LocationService = {

  getLocation(location) {
    return locations[location];
  },

  getPolygon(obj) {
    let location = this.getLocation(obj.location);
    switch (obj.depth) {
      case 1:
        let { geometry } = location.polygon.features[0];
        return geometry;
      case 2:
        let { features } = location.polygon;
        return features[0];
      case 3:
        return location.polygon;
      default:
        return location.polygon;
    }
  }
};

export default LocationService;
