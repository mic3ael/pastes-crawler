'use strict';

const { DocumentClient } = require('aws-sdk/clients/dynamodb');

function batchWrite(params) {
  const { dynamodb } = this;
  return dynamodb.batchWrite(params).promise(); //TODO: handle UnprocessedItems
}

function init(options = {}) {
  const dynamodb = new DocumentClient(options);
  return {
    batchWrite: batchWrite.bind({ dynamodb }),
  };
}

module.exports = init;
