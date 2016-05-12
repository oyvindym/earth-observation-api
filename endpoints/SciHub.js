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

function getNameAttribute(objects, attribute) {
  return objects.find(obj => {
    return obj.name === attribute;
  });
}

function getRelAttribute(objects, attribute) {
  return objects.find(obj => {
    return obj.rel === attribute;
  });
}

const SciHub = {

  config: EndpointService.getEndpoint('scihub'),
  start: new Date(),

  init(query) {
    this.polygon = LocationService.getPolygon({location: query.location, depth: 1});
    this.date = DateService.getDate({daysAgo: query.daysAgo});
    this.maxCloudCoverage = query.maxCloudCoverage;
    return this;
  },

  getAcquriedSince() {
    return `ingestiondate:[${this.date} TO NOW ]`;
  },

  getPolygon() {
    return `footprint:"Intersects(${WKTConverter.convertPolygon(this.polygon)})"`;
  },

  getCloudCoverage() {
    return `cloudcoverpercentage:[0 TO ${this.maxCloudCoverage}]`;
  },

  getPlatformName() {
    return 'platformname:Sentinel-2';
  },

  getQuery() {
    return `${this.getPlatformName()} AND ${this.getPolygon()} AND ${this.getAcquriedSince()} AND ${this.getCloudCoverage()}`;
  },

  get() {
    return new Promise((resolve, reject) => {
      let data = {
        searchDate: new Date(),
        endpoint: 'SciHub',
        entries: []
      };
      request
        .get(this.config.uri)
        .auth(this.config.username, this.config.password)
        .query({
          format: 'json',
          q: this.getQuery()
        })
        .end((error, response) => {
          if (response.statusCode === HttpOk) {
            response.body.feed.entry.map(e => {
              data.entries.push({
                acquired: getNameAttribute(e.date, 'ingestiondate').content,
                cloudCover: parseFloat(e.double.content),
                download: e.link[0].href,
                geometry: GeoJSONConverter.convertPolygon(getNameAttribute(e.str, 'footprint').content),
                id: e.id,
                platform: getNameAttribute(e.str, 'platformserialidentifier').content,
                provider: response.body.feed.author.name,
                thumbnail: getRelAttribute(e.link, 'icon').href,
                custom: {
                  summary: e.summary,
                  size: getNameAttribute(e.str, 'size').content
                }
              });
            });            
            resolve({status: response.statusCode, data: data});
          } else {
            reject({status: response.statusCode, data: response.body});
          }
        });
    });
  },

  save(data, status) {
    console.log('SciHub:', HttpExplanationService.verbose(status), `(${new Date() - this.start}ms)`);
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

export default SciHub;
