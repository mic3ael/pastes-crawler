'use strict';

const { SQS } = require('aws-sdk');

function sendBatch(queueUrl, messages) {
  const { sqs } = this;
  return sqs.sendMessageBatch({ QueueUrl: queueUrl, Entries: messages }).promise();
}

function deleteBatch(queueUrl, messages) {
  const { sqs } = this;
  return sqs.deleteMessageBatch({ QueueUrl: queueUrl, Entries: messages }).promise();
}

function init(options = {}) {
  const sqs = new SQS(options);
  return {
    sendBatch: sendBatch.bind({ sqs }),
    deleteBatch: deleteBatch.bind({ sqs }),
  };
}

module.exports = init;
