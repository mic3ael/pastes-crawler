const { SQS } = require('aws-sdk');

function sendBatch(messages) {
  const { sqs, queueUrl } = this;
  return sqs.sendMessageBatch({ Entries: messages, QueueUrl: queueUrl }).promise();
}

function init(options, queueUrl) {
  const sqs = new SQS(options);
  return {
    sendBatch: sendBatch.bind({ sqs, queueUrl }),
  };
}

module.exports = init;
