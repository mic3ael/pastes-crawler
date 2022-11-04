'use strict';

const AWS = require('aws-sdk');
const logger = require('../../utils/logger');
const service = require('./service');
const http = require('../../utils/http/client');
const queue = require('../../utils/queue');
const moduleInit = require('./module');
const storage = require('../../utils/storage');

const APP_NAME = process.env.APP_NAME;
const PASTEBIN_URL = process.env.PASTES_URL;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;

AWS.config.update({
  region: AWS_REGION,
  s3: {
    endpoint: AWS_ENDPOINT,
  },
  sqs: {},
  s3ForcePathStyle: true,
});

const httpClient = http(PASTEBIN_URL);

const queueClient = queue();

const pastesModule = moduleInit();

const storageClient = storage();

const pastesService = service({ httpClient, pastesModule, queueClient, storageClient }, { appName: APP_NAME });

async function run() {
  try {
    logger.info('index:run -> about to start');
    await pastesService.crawl();
    logger.info('index:run -> done');
  } catch (err) {
    logger.error(`index:run -> ${err.message}`);
    throw new Error('something went wrong check logs');
  }
}

exports.run = run;
