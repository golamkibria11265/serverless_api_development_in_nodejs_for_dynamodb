const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require("moment-timezone");
const date = new Date();

module.exports.createDriver = async (event) => {
  var data = JSON.parse(event.body);
  data.type = data.type;
  data.name = data.name;
  data.license_number = data.license_number;
  data.nid_number = data.nid_number;
  data.status = "returned";
  data.validity = moment(date).format("DD-MM-YYYY");
  data.phone = data.phone;
  data.created_at = Date.now();
  data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DD:mm:ss");
  data.pk = data.type.toLowerCase() + "-" + data.name.slice(0, 5).toLowerCase() + "-" + data.phone;
  data.sk = data.pk;
  data.created_by = data.created_by;
  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: "pk <> :pk",
    ExpressionAttributeValues: {
      ":pk": data.pk,
    },
  };
  try {
    await dynamodb.put(params, function (error, value) {
      if(value){
        let activityLogData = {}
        activityLogData.pk = "activity-log" + "-" + data.created_by +"-"+ (data.created_date? data.created_date : moment(date).tz("Asia/Dhaka").format("YYYY-MM-DD:mm:ss"));
        activityLogData.sk = activityLogData.pk;
        activityLogData.type = "activity-log";
        activityLogData.created_by = data.created_by;
        activityLogData.id = data.created_by;
        activityLogData.created_date = data.created_date;
        activityLogData.created_at = Date.now();
        activityLogData.status = "create";
        const param = {
          TableName: process.env.tableName,
          Item: activityLogData,
        };
        dynamodb.put(param).promise();
      }else {
          console.log(error, "error")
      }
    })
      .promise();
    return data
  }
  catch (error) {
    return { "error": error }
  }
};
