'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import WKTConverter from '../converters/WKTConverter';
import GeoJSONConverter from '../converters/GeoJSONConverter';

import { HttpOk } from '../statuscodes';

const DigitalGlobe = {

  config: EndpointService.getEndpoint('digitalglobe'),
  start: new Date(),

  init(query) {
    this.params = {
      searchAreaWkt: WKTConverter.convertPolygon((LocationService.getPolygon({location: query.location, depth: 1}))),
      types: ['Acquisition'],
      startDate: DateService.getDate({daysAgo: query.daysAgo}),
      filters: [`cloudCover < ${query.maxCloudCoverage}`]
    };
    return this;
  },

  get() {
    return new Promise((resolve, reject) => {
      let data = {
        searchDate: new Date(),
        endpoint: 'DigitalGlobe',
        entries: []
      };
      request
        .post(this.config.uri)
        .set('Authorization', `Bearer ${this.config.accessToken}`)
        .send(this.params)
        .end((error, response) => {
          if (response.status === HttpOk) {
            response.body.results.map(e => {
              data.entries.push({
                acquired: e.properties.timestampWkt,
                cloudCover: parseFloat(e.properties.cloudCover),
                download: null,
                geometry: GeoJSONConverter.convertPolygon(e.properties.footprintWkt),
                id: e.identifier,
                platform: e.properties.sensorPlatformName !== undefined ? e.properties.sensorPlatformName : null,
                provider: e.properties.vendorName !== undefined ? e.properties.vendorName : e.type,
                thumbnail: e.properties.browseURL,
                custom: {}
              });
            });            
            resolve({status: response.status, data: data});
          } else {
            reject({status: response.status, data: reponse.body});
          }
        });
    });
  },

  save(data, status) {
    console.log('DigitalGlobe:', HttpExplanationService.verbose(status), `(${new Date() - this.start}ms)`);
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

export default DigitalGlobe;
