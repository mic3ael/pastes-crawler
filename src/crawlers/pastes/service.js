'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

const QUEUE_URL = process.env.QUEUE_URL;
const PASTES_BUCKET_NAME = process.env.PASTES_BUCKET_NAME;

async function crawl() {
  try {
    const { dataSources, config } = this;
    logger.info('service:crawl -> about to load pastes');

    // load pastes
    const pastesHtml = await dataSources.httpClient.get('/');
    const pastes = dataSources.pastesModule.pastes(pastesHtml);
    logger.info('service:crawl -> loaded');

    logger.info('service:crawl -> about to load past');
    // load past
    const httpPromises = [];
    for (let { id } of pastes) {
      httpPromises.push(dataSources.httpClient.get(id));
    }

    const pastHtmls = await Promise.all(httpPromises); //TODO: throttle, still okay because 8 pastes each run
    const enrichedPastes = [];
    const pastesSource = [];
    pastHtmls.forEach((pastHtml, index) => {
      const { author, source } = dataSources.pastesModule.past(pastHtml);
      const past = pastes[index];
      pastesSource.push({ source, id: past.id });
      enrichedPastes.push({ ...past, author });
    });

    logger.info('service:crawl -> loaded');

    logger.info('service:crawl -> about to store pastes source');
    const storagePromises = [];
    for (let { source, id } of pastesSource) {
      const key = `${id}.txt`;
      const params = { Bucket: PASTES_BUCKET_NAME, Key: key, Body: source };
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
        MessageGroupId: ePast.id,
        MessageBody: JSON.stringify(ePast),
        MessageDeduplicationId: ePast.id,
        MessageAttributes: {
          src: {
            StringValue: config.appName,
            DataType: 'String',
          },
        },
      };
    });
    await dataSources.queueClient.sendBatch(QUEUE_URL, messages);
    logger.info('service:crawl -> sent: ');
  } catch (err) {
    logger.error(`service:crawl -> ${err.message}`);
    throw err;
  }
}

function init(dataSources, config) {
  const diParams = {
    dataSources,
    config,
  };

  return {
    crawl: crawl.bind(diParams),
  };
}

module.exports = init;
