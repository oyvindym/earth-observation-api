'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import { HttpOk } from '../statuscodes';

const UrtheCast = {

  config: EndpointService.getEndpoint('urthecast'),
  start: new Date(),

  init(query) {
    this.params = {
      api_key: this.config.apiKey,
      api_secret: this.config.apiSecret,
      acquired_gte: DateService.getDate({daysAgo: query.daysAgo}),
      cloud_coverage_lte: query.maxCloudCoverage,
      geometry_intersects: JSON.stringify(LocationService.getPolygon({location: query.location, depth: 1}))
    };
    return this;
  },

  get() {
    return new Promise((resolve, reject) => {
      let data = {
        searchDate: new Date(),
        endpoint: 'UrtheCast',
        entries: []
      };
      request
        .get(this.config.uri)
        .query(this.params)
        .end((error, response) => {
          if (response.status === HttpOk) {
            response.body.payload.map(e => {
              data.entries.push({
                acquired: e.acquired,
                cloudCover: e.cloud_coverage,
                download: null,
                geometry: e.geometry,
                id: e.id,
                platform: e.sensor_platform !== undefined ? e.sensor_platform : e.platform,
                provider: e.owner,
                thumbnail: null,
                custom: {
                  season: e.season,
                } 
              });
            });            
            resolve({status: response.status, data: data});
          } else {
            reject({status: response.status, data: response.body});
          }
        });
    });
  },

  save(data, status) {
    console.log('UrtheCast:', HttpExplanationService.verbose(status), `(${new Date() - this.start}ms)`);
    FileService.write({
      filepath: this.config.filepath,
      data: data
    });
  },

  run() {
    this
      .get()
      .then(result => {
        this.save(result.data, result.status);
      }, error => {
        this.save(error.data, error.status);
      });
  }
};

export default UrtheCast;
