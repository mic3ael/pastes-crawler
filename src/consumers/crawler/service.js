'use strict';

const logger = require('../../utils/logger');

async function consume(records) {
  try {
    const { dataSources } = this;

    // map db & records, record can be produced by many sources
    const dbValues = new Map();

    for (let record of records) {
      const src = record.messageAttributes.src.stringValue;

      if (!dbValues.has(src)) {
        dbValues.set(src, []);
      }

      dbValues.get(src).push({ ...JSON.parse(record.body) });
    }

    logger.info('service:consume -> about to save records');
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

      await dataSources.db.batchWrite(params);
    }
    //TODO: remove from sqs message
    logger.info('service:consume -> saved');
  } catch (err) {
    logger.error(`service:consume -> ${err.message}`);
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
