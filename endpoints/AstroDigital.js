'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import { HttpOk } from '../statuscodes';

const AstroDigital = {

  endpoint: 'AstroDigital',
  config: EndpointService.getEndpoint('astrodigital'),
  start: new Date(),

  init(query) {
    this.location = query.location;
    this.params = {
      limit: 50,
      intersects: JSON.stringify(LocationService.getPolygon({location: query.location, depth: 3})),
      date_from: DateService.getDate({daysAgo: query.daysAgo}),
      cloud_from: 0,
      cloud_to: query.maxCloudCoverage
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
        .query(this.params)
        .end((error, response) => {
          if (response.status === HttpOk) {
            response.body.results.map(e => {
              data.entries.push({
                acquired: e.sceneStartTime,
                cloudCover: e.cloudCoverFull >= 0.0 ? e.cloudCoverFull : null,
                download: null,
                geometry: e.boundingBox,
                id: e.sceneID,
                platform: e.sensor,
                provider: response.body.meta.name,
                thumbnail: e.browseURL,
                custom: {
                  dayOrNight: e.dayOrNight,
                  countries: e.countries.reduce((a, b) => {
                    return a.concat(b.name);
                  }, [])
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

export default AstroDigital;
