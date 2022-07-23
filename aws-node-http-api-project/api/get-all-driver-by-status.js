const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  let data, accumulated=[], ExclusiveStartKey;
  let query = event.queryStringParameters;
  var status = query.status;
  try {
    do {
      const params = {
        TableName: process.env.tableName,
        ExclusiveStartKey,
        Limit: 50,
        IndexName: "type-status-index",
        KeyConditionExpression: "#type = :type AND #status = :status",

        ExpressionAttributeNames: {
          "#type": "type",
          "#status": "status",
        },

        ExpressionAttributeValues: {
          ":type": "driver",            
          ":status": status,
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

