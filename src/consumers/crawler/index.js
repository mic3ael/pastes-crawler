'use strict';

const AWS = require('aws-sdk');
const serviceInit = require('./service');
const dbInit = require('../../utils/db');
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

const db = dbInit();
const service = serviceInit({ db });

async function run(event) {
  try {
    logger.info('crawler:index -> start');
    await service.consume(event.Records);
    logger.info('crawler:index -> done');
  } catch (err) {
    logger.error(`crawler:index -> ${err.message}`);
    throw new Error('Something went wrong');
  }
}
exports.run = run;
