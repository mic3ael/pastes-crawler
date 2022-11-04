const { S3 } = require('aws-sdk');

function upload(params) {
  const { s3 } = this;
  const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
  return s3.upload(params, options).promise();
}

function init(options = {}) {
  const s3 = new S3(options);
  return {
    upload: upload.bind({ s3 }),
  };
}

module.exports = init;
