const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  let data;
  let query = event.queryStringParameters;
  var id = query.id;
  try {
      const params = {
        TableName: process.env.tableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pk": id,            
        },
      }
     data = await dynamodb.query(params).promise();
    return data.Items;
   } catch (e) {
    return e;
  }
};

