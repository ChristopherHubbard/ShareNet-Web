import boto3

def create_dynamodb_instance(table_name, region_name='us-east-2'):

    # Get DynamoDB to get the users_table
    dynamoDB = boto3.resource('dynamodb', region_name=region_name)
    return dynamoDB.Table(table_name)