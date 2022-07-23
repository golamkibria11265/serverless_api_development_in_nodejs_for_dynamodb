const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  let data, accumulated=[], ExclusiveStartKey;
  try {
    do {
      const params = {
        TableName: process.env.tableName,
        ExclusiveStartKey,
        Limit: 50,
        IndexName: "type-status-index",
        KeyConditionExpression: "#type = :type",

        ExpressionAttributeNames: {
          "#type": "type",
        },

        ExpressionAttributeValues: {
          ":type": "driver",
        },
      }
     data = await dynamodb.query(params).promise();
      ExclusiveStartKey = data.LastEvaluatedKey;
      accumulated = [...accumulated, ...data.Items];
    } while (data.LastEvaluatedKey);
    return accumulated;
   } catch (e) {
    return e;
  }
};

