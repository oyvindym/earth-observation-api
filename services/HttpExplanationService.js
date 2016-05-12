'use strict';

import { 
  HttpOk,
  HttpCreated,
  HttpNoContent,
  HttpBadRequest,
  HttpUnauthorized,
  HttpForbidden,
  HttpNotFound,
  HttpConflict,
  HttpInternalServerError
} from '../statuscodes';

const HttpExplanationService = {

  verbose(statusCode) {
    switch (statusCode) {
      case HttpOk: return '200 OK';
      case HttpCreated: return '201 Created';
      case HttpNoContent: return '204 No Content';
      case HttpBadRequest: return '400 Bad Request';
      case HttpUnauthorized: return '401 Unauthorized';
      case HttpForbidden: return '403 Forbidden';
      case HttpNotFound: return '404 Not Found';
      case HttpConflict: return '409 Conflict';
      case HttpInternalServerError: return '500 Internal Server Error';
      default: return `Unsupported status code ${statusCode}`;
    }
  }
};

export default HttpExplanationService;
