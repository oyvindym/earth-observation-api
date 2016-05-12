'use strict';

import { endpoints } from '../config';

const EndpointService = {

  getEndpoint(endpoint) {
    return endpoints[endpoint];
  }
};

export default EndpointService;
