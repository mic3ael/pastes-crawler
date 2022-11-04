const { SQS } = require('aws-sdk');

function sendBatch(queueUrl, messages) {
  const { sqs } = this;
  return sqs.sendMessageBatch({ Entries: messages, QueueUrl: queueUrl }).promise();
}

function init(options = {}) {
  const sqs = new SQS(options);
  return {
    sendBatch: sendBatch.bind({ sqs }),
  };
}

module.exports = init;
