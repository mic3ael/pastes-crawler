'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../../../utils/logger');

const actions = (diParams) => ({
  async crawl() {
    try {
      const { dataSources, modules, config } = diParams;
      logger.info('service:crawl -> about to connect cache');
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

      logger.info({ size: newPastes.length }, 'service:crawl -> about to load new past');
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
        const past = newPastes[index];
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
        const { Location, key, Bucket } = uploads[i];
        enrichedPastes[i].source = config.bucketBaseUrl ? `${config.bucketBaseUrl}/${Bucket}/${key}` : Location;
      }

      logger.info({ size: uploads.length }, 'service:crawl -> stored');
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
      logger.info({ size: messages.length }, 'service:crawl -> sent');
      logger.info('service:crawl -> about to cache new pastes');
      const cacheSetPromises = [];
      for (const { id } of enrichedPastes) {
        cacheSetPromises.push(dataSources.cacheClient.set(id, id));
      }
      await Promise.all(cacheSetPromises); //TODO: throttle, still okay because 8 pastes each run
      logger.info({ size: cacheSetPromises.length }, 'service:crawl -> set');
      logger.info('service:crawl -> about to disconnect cache');
      await dataSources.cacheClient.disconnect();
      logger.info('service:crawl -> disconnected');
    } catch (err) {
      logger.error(err, `service:crawl`);
      throw err;
    }
  },
});

module.exports = (dataSources, modules, config) => actions({ dataSources, modules, config });
