'use strict';

const AWS = require('aws-sdk');
const logger = require('../../utils/logger');
const service = require('./service');
const http = require('../../utils/http/client');
const queue = require('../../utils/queue');
const moduleInit = require('./module');
const storage = require('../../utils/storage');
const cacheInit = require('../../utils/cache');

const APP_NAME = process.env.APP_NAME;
const PASTEBIN_URL = process.env.URL;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
const CACHE_URL = process.env.CACHE_URL;
const QUEUE_URL = process.env.QUEUE_URL;
const PASTES_BUCKET_NAME = process.env.BUCKET_NAME;

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

const parser = moduleInit();

const storageClient = storage();

const cacheClient = cacheInit({ url: CACHE_URL }, { appName: APP_NAME });

const pastesService = service(
  { httpClient, queueClient, storageClient, cacheClient },
  { parser },
  { appName: APP_NAME, queueUrl: QUEUE_URL, bucketName: PASTES_BUCKET_NAME }
);

async function run() {
  try {
    logger.info('index:run -> about to start');
    await pastesService.crawl();
    logger.info('index:run -> done');
  } catch (err) {
    logger.error(`index:run -> ${err.message}`);
    throw new Error('Something went wrong');
  }
}
exports.run = run;
