const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.main = async (event) => {
  var query = event.queryStringParameters;
  var id = query.id.split(",");
  var pk = id[0];
  var sk = id[1];
  var data = JSON.parse(event.body);
  try {
      const params_for_trip = {
        TableName: process.env.tableName,
        Key: {
            pk: pk,
            sk: sk,
        },
        UpdateExpression: "SET  #driver_id = :driver_id,  #driver_name = :driver_name,  #driver_phone = :driver_phone",
        ExpressionAttributeNames: {
          "#driver_id": "driver_id",
          "#driver_name": "driver_name",
          "#driver_phone": "driver_phone",
        },
        ExpressionAttributeValues: {
          ":driver_id": data.driver_id,   
          ":driver_name": data.driver_name,  
          ":driver_phone": data.driver_phone,           
        },
        ReturnValues: "UPDATED_NEW"
      }
     return await dynamodb.update(params_for_trip).promise().then(async(updated_data)=>{
        const params_for_driver = {
          TableName: process.env.tableName,
          Key: {
              pk: updated_data.Attributes.driver_id,
              sk: updated_data.Attributes.driver_id,
          },
          UpdateExpression: "SET  #status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": "rented",          
          },
          ReturnValues: "UPDATED_NEW"
        }
        return await dynamodb.update(params_for_driver).promise().then((data)=>{
          return "success"
        })
     });
   } catch (e) {
    return e;
  }
};

