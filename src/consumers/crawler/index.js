'use strict';

const AWS = require('aws-sdk');
const serviceInit = require('./service');
const dbInit = require('../../utils/db');
const queueInit = require('../../utils/queue');
const logger = require('../../utils/logger');

const AWS_REGION = process.env.AWS_REGION;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;

AWS.config.update({
  region: AWS_REGION,
  dynamodb: {
    endpoint: AWS_ENDPOINT,
  },
  sqs: {},
});

const dbClient = dbInit();
const queueClient = queueInit();
const service = serviceInit({ dbClient, queueClient });

async function run(event) {
  try {
    logger.info('crawler:index -> start');
    await service.consume(event.Records);
    logger.info('crawler:index -> done');
  } catch (err) {
    logger.error(err, `crawler:index`);
    throw new Error('Something went wrong');
  }
}

exports.run = run;