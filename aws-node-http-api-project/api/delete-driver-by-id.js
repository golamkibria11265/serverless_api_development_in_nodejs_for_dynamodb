const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  let query = event.queryStringParameters;
  var id = query.id;
  try {
      const params = {
        TableName: process.env.tableName,
        Key: {
            pk: id,
            sk: id,
        },
      }
    await dynamodb.delete(params).promise().then(data=>{
        if(data){
            console.log("driver is deleted")
        }
    });
    return {messages: "driver is deleted"};
   } catch (e) {
    return e;
  }
};

