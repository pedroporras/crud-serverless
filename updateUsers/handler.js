const aws = require('aws-sdk');
const crypto = require('crypto');

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

const updateUsers = async (event, context) => {

    const userId = event.pathParameters.id;
    const userBody = JSON.parse(event.body);
    userBody.pk = userId;

    const params = {
        TableName: "usersTable",
        Key: {
            pk: userId
        },
        UpdateExpression: "set #name = :name",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": userBody.name
        },
        ReturnValues: "ALL_NEW"
    };

    console.log(params.Item);

    return dynamoDb.update(params).promise().then((data) => {
        console.log(data);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': data.Attributes})
        }
    }).catch((err) => {
        console.log(err);
    });


}

module.exports = {
    updateUsers
}
