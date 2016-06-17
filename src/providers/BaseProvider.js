import React from 'react';
import utils from '../utils';

function makeHttpRequest(method, uri, body, headers, callback) {
  var request = new XMLHttpRequest();

  request.open(method.toUpperCase(), uri, true);

  if (headers) {
    for (var name in headers) {
      var value = headers[name];
      request.setRequestHeader(name, value);
    }
  }

  request.onreadystatechange = function () {
    // 4 = Request finished and response is ready.
    // Ignore everything else.
    if (request.readyState !== 4) {
      return;
    }

    var result = {
      status: request.status,
      responseJSON: null
    };

    try {
      if (request.responseText) {
        result.responseJSON = JSON.parse(request.responseText);
      }
      callback(null, result);
    } catch(e) {
      callback(e);
    }
  };

  if (body && typeof body === 'object') {
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.send(JSON.stringify(body));
  } else {
    request.send();
  }
}

export default class BaseProvider {
  constructor(endpoints) {
    var defaultEndpoints = {
      baseUri: null
    };

    this.endpoints = utils.mergeObjects(defaultEndpoints, endpoints);
  }

  _makeRequest(method, path, body, callback) {
    var uri = this._buildEndpoint(path);

    var headers = {
      'Accept': 'application/json'
    };

    makeHttpRequest(method, uri, body, headers, function (err, result) {
      if (err) {
        return callback(err);
      }

      var data = result.responseJSON || {};

      if (result.status === 200) {
        callback(null, data);
      } else {
        var error = new Error(data.message || data.error || 'A request to the API failed.');
        error.status = result.status;
        callback(error);
      }
    });
  }

  _buildEndpoint(endpoint) {
    return (this.endpoints.baseUri || '') + endpoint;
  }
}
