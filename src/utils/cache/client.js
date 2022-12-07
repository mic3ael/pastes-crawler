'use strict';

const { createClient } = require('redis');
const logger = require('../logger');

const actions = (client, config) => ({
  connect() {
    return client.connect();
  },
  disconnect() {
    return client.disconnect();
  },
  set(key, value, expire = 86400 /* 1 day */) {
    return client.set(this.genKey(config.appName, key), value, {
      EX: expire,
      NX: true,
    });
  },
  get(key) {
    return client.get(this.genKey(config.appName, key));
  },
  genKey(baseKey, key) {
    return `${baseKey}:${key}`;
  },
});

function init(options, config) {
  const client = createClient(options);
  client.on('error', (err) => logger.error(`cache:client:redis -> ${err.message}`));
  client.on('connect', () => logger.info('cache:client:redis -> connected'));
  return actions(client, config);
}

module.exports = init;
