const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require("moment-timezone");
const date = new Date();

module.exports.createOrder = async (event) => {
    var data = JSON.parse(event.body);
    try {
            const params_order_count = {
                TableName: process.env.tableName,
                IndexName: "type-status-index",
                KeyConditionExpression: "#type = :type",
                ExpressionAttributeNames: {
                    "#type": "type",
                },
                ExpressionAttributeValues: {
                    ":type": "order",
                },
                Select:"COUNT",
            }
            const params_trip_count = {
                TableName: process.env.tableName,
                IndexName: "type-status-index",
                KeyConditionExpression: "#type = :type",
                ExpressionAttributeNames: {
                    "#type": "type",
                },
                ExpressionAttributeValues: {
                    ":type": "trip",
                },
                Select:"COUNT",
            }
            return await dynamodb.query(params_order_count).promise().then( async (total_existing_order)=>{
                return dynamodb.query(params_trip_count).promise().then(async(total_existing_trip)=>{
                    let current_date = data.created_date.split("T")[0]
                    data.pk = `order-`+`${current_date}-`+`${total_existing_order.Count+1}`;
                    data.sk = `order-`+`${current_date}-`+`${total_existing_order.Count+1}`;
                    data.type = "order";
                    data.id = data.id;
                    data.name = data.name;
                    data.phone = data.phone;
                    data.email = data.email;
                    data.status = "successful";
                    data.created_at = data.created_at;
                    data.created_date = data.created_date;
                    const params_order_create = {
                        TableName: process.env.tableName,
                        Item: data,
                      };
                    return await dynamodb.put(params_order_create).promise().then(async(result)=>{
                        let trips = [];
                        for (let i = 1; i < data.number_of_trips+1; i++) {
                            trip_data = {}
                            trip_data.pk = `order-`+`${current_date}-`+`${total_existing_order.Count+1}`;
                            trip_data.sk = `trip-`+`${current_date}-`+`${total_existing_trip.Count+i}`;
                            trip_data.type = "trip";
                            trip_data.id = data.id;
                            trip_data.name = data.name;
                            trip_data.phone = data.phone;
                            trip_data.email = data.email;
                            trip_data.status = data.status;
                            trip_data.created_at = data.created_at;
                            trip_data.created_date = data.created_date;
                            trips.push({"PutRequest":{"Item":trip_data}})
                        }
                        return await dynamodb.batchWrite({"RequestItems":{"smart_truck":trips}}).promise().then((data)=>{
                            return "success"
                        });
                    });
                });
            });
    } catch (error) {
        return { "error": error }
    }
};
