const aws = require('aws-sdk');

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamoDb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const getUsers = async (event, context) => {
    const userId = event.pathParameters.id;
    const params = {
        ExpressionAttributeValues: {
            ":pk": userId
        },
        KeyConditionExpression: "pk = :pk",
        TableName: "usersTable"
    };

    return dynamoDb.query(params).promise().then((data) => {
        console.log(data);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': data})
        }
    }).catch((err) => {
        console.log(err);
    });


}

module.exports = {
    getUsers
}
