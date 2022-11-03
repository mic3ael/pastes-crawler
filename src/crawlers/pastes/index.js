'use strict';

const logger = require('../../utils/logger');
const service = require('./service');
const http = require('../../utils/http/client');
const queue = require('../../utils/queue');
const moduleInit = require('./module');

const APP_NAME = process.env.APP_NAME;
const PASTEBIN_URL = process.env.PASTES_URL;
const AWS_REGION = process.env.AWS_REGION;
const QUEUE_URL = process.env.QUEUE_URL;

const httpClient = http(PASTEBIN_URL);

const queueClient = queue({ region: AWS_REGION }, QUEUE_URL);

const pastesModule = moduleInit();

const pastesService = service(httpClient, pastesModule, queueClient, APP_NAME);

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
