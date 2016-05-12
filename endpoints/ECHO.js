'use strict';

import request from 'superagent';

import DateService from '../services/DateService';
import FileService from '../services/FileService';
import EndpointService from '../services/EndpointService';
import LocationService from '../services/LocationService';
import HttpExplanationService from '../services/HttpExplanationService';

import GeoJSONConverter from '../converters/GeoJSONConverter';

import { HttpOk } from '../statuscodes';

function getThumbnail(links) {
  let link = links.find(l => {
    return l.title === '(BROWSE)';
  });
  return link !== undefined ? link.href : null;
}

const ECHO = {

  config: EndpointService.getEndpoint('echo'),
  start: new Date(),

  init(query) {
    this.params = {
      polygon: this.convertPolygon(LocationService.getPolygon({location: query.location, depth: 1})),
      'cloud_cover[min]': 0,
      'cloud_cover[max]': query.maxCloudCoverage,
      updated_since: DateService.getDate({daysAgo: query.daysAgo})
    };
    return this;
  },

  convertPolygon(polygon) {
    return polygon.coordinates[0]
      .reverse()
      .map(coor => {
        return coor.join(',');
      })
      .join(',');
  },

  get() {
    return new Promise((resolve, reject) => {
      let data = {
        searchDate: new Date(),
        endpoint: 'ECHO',
        entries: []
      }
      request
        .get(this.config.uri)
        .query(this.params)
        .end((error, response) => {
          if (response.status === HttpOk) {
            response.body.feed.entry.map(e => {
              data.entries.push({
                acquired: null,
                cloudCover: e.cloud_cover !== undefined ? parseFloat(e.cloud_cover) : null,
                download: null,
                geometry: e.polygons !== undefined ? GeoJSONConverter.convertPolygon(e.polygons[0][0]) : null,
                id: e.producer_granule_id,
                platform: null,
                provider: 'ECHO',
                thumbnail: getThumbnail(e.links),
                custom: {
                  updated: e.updated,
                  datasetId: e.dataset_id,
                  dayOrNight: e.day_night_flag
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
    console.log('ECHO:', HttpExplanationService.verbose(status), `(${new Date() - this.start}ms)`);
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

export default ECHO;
