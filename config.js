'use strict';

const endpoints = {
  urthecast: {
    uri: 'https://api.urthecast.com/v1/archive/scenes',
    filepath: '',
    apiKey: '',
    apiSecret: ''
  },

  scihub: {
    uri: 'https://scihub.copernicus.eu/apihub/search',
    filepath: '',
    username: '',
    password: ''
  },

  echo: {
    uri: 'https://api-test.echo.nasa.gov/catalog-rest/echo_catalog/granules.json',
    filepath: '',
    username: '',
    password: ''
  },

  astrodigital: {
    uri: 'https://api.astrodigital.com/v2.0/search',
    filepath: '',
    username: '',
    password: '',
    apiKey: ''
  },

  planetlabs: {
    uri: 'https://api.planet.com/v0/scenes/ortho/',
    // uri: 'https://api.planet.com/v0/scenes/rapideye',
    // uri: 'https://api.planet.com/v0/scenes/landsat',
    filepath: '',
    username: '',
    password: '',
    apiKey: ''
  },

  digitalglobe: {
    uri: 'https://geobigdata.io/catalog/v1/search?includeRelationships=false',
    filepath: '',
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    apiKey: '',
    accessToken: '',
    refreshToken: ''
  }
};

const locations = {
  oslo: {
    polygon: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  10.311,
                  59.763
                ],
                [
                  10.311,
                  60.040
                ],
                [
                  10.978,
                  60.040
                ],
                [
                  10.978,
                  59.763
                ],
                [
                  10.311,
                  59.763
                ]
              ]
            ]
          }
        }
      ]
    }
  },

  sanFrancisco: {
    polygon: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -122.486,
                  37.712
                ],
                [
                  -122.486,
                  37.821
                ],
                [
                  -122.351,
                  37.820
                ],
                [
                  -122.351,
                  37.712
                ],
                [
                  -122.486,
                  37.712
                ]
              ]
            ]
          }
        }
      ]
    }
  }
};

export { endpoints, locations };
