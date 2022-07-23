const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  var query = event.queryStringParameters;
  var id = query.id.split(",");
  var pk = id[0];
  var sk = id[1];
  var data = JSON.parse(event.body);
  var status = data.status;
  try {
      const params = {
        TableName: process.env.tableName,
        Key: {
            pk: pk,
            sk: sk,
        },
        UpdateExpression: "SET  #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,            
        },
        ReturnValues: "UPDATED_NEW"
      }
     data = await dynamodb.update(params).promise();
    return data.Attributes;
   } catch (e) {
    return e;
  }
};

