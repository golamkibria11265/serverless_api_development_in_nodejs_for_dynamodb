const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  var query = event.queryStringParameters;
  var id = query.id;
  var data = JSON.parse(event.body);
  var nid_number = data.nid_number;
  try {
      const params = {
        TableName: process.env.tableName,
        Key: {
            pk: id,
            sk: id,
        },
        UpdateExpression: "SET  #nid_number = :nid_number",
        ExpressionAttributeNames: {
          "#nid_number": "nid_number",
        },
        ExpressionAttributeValues: {
          ":nid_number": nid_number,            
        },
        ReturnValues: "UPDATED_NEW"
      }
     data = await dynamodb.update(params).promise();
    return data.Attributes;
   } catch (e) {
    return e;
  }
};

