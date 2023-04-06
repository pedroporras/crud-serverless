import boto3, json, os

client = boto3.client('dynamodb')

IS_OFFLINE = os.environ.get('IS_OFFLINE')
if IS_OFFLINE:
    boto3.Session(
        aws_access_key_id='SOME_KEY',
        aws_secret_access_key='SOME_SECRET',
    )
    client = boto3.resource(
        'dynamodb',
        region_name='localhost',
        endpoint_url='http://localhost:8000'
    )

table = client.Table('usersTable')

def lambda_handler(event, context):

    user_id = event.get('pathParameters').get('id')
    
    result = table.delete_item(
        Key={
            'id': user_id
        }
    )
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"User {user_id} deleted successfully!"
        })
    }
    return response