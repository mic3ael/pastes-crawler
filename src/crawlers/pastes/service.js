'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

async function crawl() {
  try {
    const { dataSources, config } = this;
    logger.info('service:crawl -> about to load pastes');
    // load pastes
    const pastesHtml = await dataSources.httpClient.get('/');
    const pastes = dataSources.module.pastes(pastesHtml);
    logger.info('service:crawl -> loaded');

    logger.info('service:crawl -> about to load past');
    // load past
    const promises = [];
    for (let { ref } of pastes) {
      promises.push(dataSources.httpClient.get(ref)); //TODO throttle
    }

    const pastHtmls = await Promise.all(promises);
    const enrichedPastes = pastHtmls.map((pastHtml, index) => {
      const {author, source} = dataSources.module.past(pastHtml);
      console.log('Row 25: ', source);
      return { ...pastes[index], author };
    });
    logger.info('service:crawl -> loaded');

    // message creation
    const messages = enrichedPastes.map((ePastes) => {
      const { ref, ...ePastesRest } = ePastes;
      const id = ref;
      return {
        Id: uuidv4(),
        MessageGroupId: id,
        MessageBody: JSON.stringify({ ...ePastesRest, id }),
        MessageDeduplicationId: id,
        MessageAttributes: {
          src: {
            StringValue: config.appName,
            DataType: 'String',
          },
        },
      };
    });
    logger.info('service:crawl -> about to send messages');
    await dataSources.queue.sendBatch(messages);
    logger.info('service:crawl -> sent');
  } catch (err) {
    logger.error(`service:crawl -> ${err.message}`);
    throw err;
  }
}

function init(httpClient, module, queue, appName) {
  const diParams = {
    dataSources: { httpClient, module, queue },
    config: { appName },
  };

  return {
    crawl: crawl.bind(diParams),
  };
}

module.exports = init;
