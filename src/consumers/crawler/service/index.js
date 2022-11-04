'use strict';

const logger = require('../../../utils/logger');

const QUEUE_URL = process.env.QUEUE_URL;

async function consume(records) {
  try {
    const { dataSources } = this;

    // map db & records, record can be produced by many sources
    const dbValues = new Map();
    const queueMessagesForDelete = [];
    for (let record of records) {
      const src = record.messageAttributes.src.stringValue;

      if (!dbValues.has(src)) {
        dbValues.set(src, []);
      }

      dbValues.get(src).push({ ...JSON.parse(record.body) });
      queueMessagesForDelete.push({ ReceiptHandle: record.receiptHandle, Id: record.messageId });
    }

    // create batch write per table source
    for (const [tableName, records] of dbValues) {
      const items = [];
      for (const record of records) {
        items.push({
          PutRequest: {
            Item: record,
          },
        });
      }
      const params = {
        RequestItems: {
          [tableName]: items,
        },
      };

      logger.info('service:consume -> about to save records');
      await dataSources.dbClient.batchWrite(params);
      logger.info('service:consume -> saved');

      logger.info('service:consume -> about to remove messages from the queue');
      await dataSources.queueClient.deleteBatch(QUEUE_URL, queueMessagesForDelete);
      logger.info('service:consume -> removed');
    }
  } catch (err) {
    logger.error(err, `service:consume`);
    throw err;
  }
}

function init(dataSources) {
  const diParams = { dataSources };
  return {
    consume: consume.bind(diParams),
  };
}

module.exports = init;
