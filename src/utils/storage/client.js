'use strict';

const { S3 } = require('aws-sdk');

const actions = (s3) => ({
  upload(params) {
    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    return s3.upload(params, options).promise();
  },
});

module.exports = (options = {}) => actions(new S3(options));
