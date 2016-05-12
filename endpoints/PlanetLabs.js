'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import { HttpOk } from '../statuscodes';

const PlanetLabs = {

  config: EndpointService.getEndpoint('planetlabs'),
  start: new Date(),

  init(query) {
    this.params = {
      'cloud_cover.estimated.lt': query.maxCloudCoverage,
      'acquired.gt': DateService.getDate({daysAgo: query.daysAgo}),
      intersects: JSON.stringify(LocationService.getPolygon({location: query.location, depth: 1}))
    };
    return this;
  },

  get() {
    return new Promise((resolve, reject) => {
      let data = {
        searchDate: new Date(),
        endpoint: 'PlanetLabs',
        entries: []
      };
      request
        .get(this.config.uri)
        .auth(this.config.apiKey)
        .query(this.params)
        .end((error, response) => {
          if (response.status === HttpOk) {
            response.body.features.map(e => {
              data.entries.push({
                acquired: e.properties.acquired,
                cloudCover: e.properties.cloud_cover.estimated,
                download: e.properties.links.full,
                geometry: e.geometry,
                id: e.id,
                platform: null,
                provider: `Planet Labs (${e.properties.provider})`,
                thumbnail: e.properties.links.thumbnail,
                custom: {
                  self: e.properties.links.self
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
    console.log('PlanetLabs:', HttpExplanationService.verbose(status), `(${new Date() - this.start}ms)`);
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

export default PlanetLabs;
