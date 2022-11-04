'use strict';

const { createClient } = require('redis');

function connect() {
  return this.connect();
}

function disconnect() {
  return this.disconnect();
}

function set(key, value, expire = 86400 /* 1 day */) {
  const { client, config } = this;
  return client.set(genKey(config.appName, key), value, {
    EX: expire,
    NX: true,
  });
}

function get(key) {
  const { client, config } = this;
  return client.get(genKey(config.appName, key));
}

function genKey(baseKey, key) {
  return `${baseKey}:${key}`;
}

function init(options, config) {
  const client = createClient(options);
  client.on('error', (err) => logger.error(`cache:client:redis -> ${err.message}`));
  return {
    connect: connect.bind(client),
    disconnect: disconnect.bind(client),
    set: set.bind({ client, config }),
    get: get.bind({ client, config }),
  };
}

module.exports = init;
