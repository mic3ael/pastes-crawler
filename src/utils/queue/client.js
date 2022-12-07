'use strict';

const { SQS } = require('aws-sdk');

const actions = (sqs) => ({
  sendBatch(queueUrl, messages) {
    return sqs.sendMessageBatch({ QueueUrl: queueUrl, Entries: messages }).promise();
  },
  deleteBatch(queueUrl, messages) {
    return sqs.deleteMessageBatch({ QueueUrl: queueUrl, Entries: messages }).promise();
  },
});

module.exports = (options) => actions(new SQS(options));