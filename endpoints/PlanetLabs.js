'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import { HttpOk } from '../statuscodes';

const PlanetLabs = {

  endpoint: 'PlanetLabs',
  config: EndpointService.getEndpoint('planetlabs'),
  start: new Date(),

  init(query) {
    this.location = query.location;
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
        endpoint: this.endpoint,
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
                provider: `${this.endpoint} (${e.properties.provider})`,
                thumbnail: e.properties.links.thumbnail,
                custom: {
                  self: e.properties.links.self
                }
              });
            });            
            resolve({status: response.status, data});
          } else {
            reject({status: response.status, data: response});
          }
        });
    });
  },

  save(data, status) {
    console.log(`${this.endpoint}: ${HttpExplanationService.verbose(status)} (${new Date() - this.start}ms)`);
    FileService.write({
      endpoint: this.endpoint,
      location: this.location,
      data
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
