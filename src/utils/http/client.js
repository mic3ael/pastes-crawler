'use strict';

const url = require('url');
const axios = require('axios');
const UserAgent = require('user-agents');
const { ServerError } = require('./errors');

async function get(path) {
  try {
    const userAgent = new UserAgent();
    const resolvedUrl = url.resolve(this, path);
    const config = { url: resolvedUrl, method: 'get', timeout: 2000 };
    const headers = {
      'User-Agent': userAgent.toString(),
    };

    const res = await axios(config, { headers });
    if (res.status >= 500) {
      throw new ServerError(undefined, res.status);
    }

    return res.data;
  } catch (err) {
    throw new ServerError(err.message);
  }
}

function init(baseUrl) {
  return { get: get.bind(baseUrl) };
}

module.exports = init;
