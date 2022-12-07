'use strict';

const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const actions = (dynamodb) => ({
  batchWrite(params) {
    return dynamodb.batchWrite(params).promise(); //TODO: handle UnprocessedItems
  },
});

module.exports = (options = {}) => actions(new DocumentClient(options));
