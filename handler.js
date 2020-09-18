"use strict";
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  region: "eu-central-1",
});

const queueUrl = "QUEUE_URL";

module.exports.transactionSender = async (event, context, callback) => {
  let data = JSON.parse(event.body);
  let params = {
    MessageBody: JSON.stringify({
      messageId: data.messageId,
      data: data.data,
    }),
    QueueUrl: queueUrl,
  };

  console.log("params", params);
  console.log("data", data);

  try {
    let data = await sqs.sendMessage(params).promise();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ data: data }),
    });
  } catch (error) {
    console.log("error", error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    });
  }
};

module.exports.transactionReciever = async (event, context, callback) => {
  console.log("event", event);
  for (const { messageId, body } of event.Records) {
    console.log("SQS messaged %s: %j", messageId, body);
  }
  context.done(null, "");
};

module.exports.test = async (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `SQS event processed ${event} messages`,
      },
      null,
      2
    ),
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
