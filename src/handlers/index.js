const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const AWS_REGION = process.env.AWS_REGION;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT;

const documentClient = new DocumentClient({
  endpoint: AWS_ENDPOINT,
  region: AWS_REGION,
});

async function consume(event) {
  const dbValues = new Map();

  for (let record of event.Records) {
    const src = record.messageAttributes.src.stringValue;

    if (!dbValues.has(src)) {
      dbValues.set(src, []);
    }

    dbValues.get(src).push({ ...JSON.parse(record.body) });
  }

  dbValues.forEach(async (values, tableName) => {
    const items = values.map((value) => {
      const item = {};
      for (const prop in value) {
        item[prop] = value[prop];
      }
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    const params = {
      RequestItems: {
        [tableName]: items,
      },
    };

    try {
      await documentClient.batchWrite(params).promise();
    } catch (err) {
      console.log('Row 47 err: ', err);
    }
  });
  //TODO: remove from sqs message
}

exports.consume = consume;
