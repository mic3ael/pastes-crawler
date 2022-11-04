'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

async function crawl() {
  try {
    const { dataSources, modules, config } = this;
    logger.info('service:crawl -> about to cache connect');
    await dataSources.cacheClient.connect();
    logger.info('service:crawl -> connected');
    logger.info('service:crawl -> about to load pastes');

    // load pastes
    const pastesHtml = await dataSources.httpClient.get('/');
    const pastes = modules.parser.pastes(pastesHtml);
    logger.info('service:crawl -> loaded');

    logger.info('service:crawl -> filter all exists pastes');
    // check if exist
    const cacheGetPromises = [];
    for (let { id } of pastes) {
      cacheGetPromises.push(dataSources.cacheClient.get(id));
    }

    const cache = await Promise.all(cacheGetPromises); //TODO: throttle, still okay because 8 pastes each run
    const newPastes = [];

    for (let i = 0; i < cache.length; i++) {
      if (cache[i]) continue;
      newPastes.push(pastes[i]);
    }
    logger.info('service:crawl -> filtered');

    if (!newPastes.length) {
      logger.info('service:crawl -> no new pastes skipping...');
      return;
    }

    logger.info('service:crawl -> about to load new past');
    // load past
    const httpPromises = [];
    for (const { id } of newPastes) {
      httpPromises.push(dataSources.httpClient.get(id));
    }

    const pastHtmls = await Promise.all(httpPromises); //TODO: throttle, still okay because 8 pastes each run
    const enrichedPastes = [];
    const pastesSource = [];
    pastHtmls.forEach((pastHtml, index) => {
      const { author, source } = modules.parser.past(pastHtml);
      const past = pastes[index];
      pastesSource.push({ source, id: past.id });
      enrichedPastes.push({ ...past, author });
    });

    logger.info('service:crawl -> loaded');

    logger.info('service:crawl -> about to store pastes source');
    const storagePromises = [];
    for (const { source, id } of pastesSource) {
      const key = `${id}.txt`;
      const params = { Bucket: config.bucketName, Key: key, Body: source };
      storagePromises.push(dataSources.storageClient.upload(params));
    }
    const uploads = await Promise.all(storagePromises); //TODO: throttle, still okay because 8 pastes each run
    for (let i = 0; i < uploads.length; i++) {
      const { Location } = uploads[i];
      enrichedPastes[i].source = Location;
    }

    logger.info('service:crawl -> stored');
    logger.info('service:crawl -> about to send messages');
    // message creation
    const messages = enrichedPastes.map((ePast) => {
      return {
        Id: uuidv4(),
        MessageBody: JSON.stringify(ePast),
        MessageAttributes: {
          src: {
            StringValue: config.appName,
            DataType: 'String',
          },
        },
      };
    });
    await dataSources.queueClient.sendBatch(config.queueUrl, messages);
    logger.info('service:crawl -> sent');
    logger.info('service:crawl -> set cache for new pastes');
    const cacheSetPromises = [];
    for (let { id } of enrichedPastes) {
      cacheSetPromises.push(dataSources.cacheClient.set(id, id));
    }
    await Promise.all(cacheSetPromises);
    logger.info('service:crawl -> set');
    logger.info('service:crawl -> about to cache disconnect');
    await dataSources.cacheClient.disconnect();
    logger.info('service:crawl -> disconnected');
  } catch (err) {
    logger.error(`service:crawl -> ${err.message}`);
    throw err;
  }
}

function init(dataSources, modules, config) {
  const diParams = {
    dataSources,
    modules,
    config,
  };

  return {
    crawl: crawl.bind(diParams),
  };
}

module.exports = init;
