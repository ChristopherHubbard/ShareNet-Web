import json
from lambda_decorators import cors_headers

# Imports from user packages
import services

@cors_headers
def new_user(event, context):

    # Create the Dynamo Instance
    user = json.loads(event['body'])['body']

    # Call the registration on the user service
    if not services.register_user(user=user):

        # Registration failed
        status = 500
    else:

        # Registration success
        status = 200

    # Set the output as successful
    return {
        'statusCode': status
    }

@cors_headers
def login_user(event, context):

    # Get the user data
    user = event['queryStringParameters']

    # Call the user service
    try:
        body = services.login(user=user)
        status = 200
    except:

        # There was an error -- use code 409?
        body = {}
        status = 409

    return {
        'statusCode': status,
        'body': json.dumps(body)
    }

@cors_headers
def delete_user(event, context):

    # Get the user data
    user = event['queryStringParameters']

    try:
        services.delete_user(user=user)
        status = 200
    except:

        # Some error on delete -- return 500
        status = 500

    return {
        'statusCode': status
    }

#Device APIs
@cors_headers
def new_device(event, context):

    device = json.loads(event['body'])['body']

    # Call the device service
    try:
        succeeded, ret_dev = services.register_device(device=device)

        if succeeded:

            body = ret_dev
            status = 200
        else:

            body = {}
            status = 409
    except:

        body = {}
        status = 409

    # Return the response
    return {
        'statusCode': status,
        'body': json.dumps(body)
    }

@cors_headers
def find_device_by_code(event, context):

    # Extract the code
    code = event['queryStringParameters']['code']

    # Call the connection service
    try:
        # Set the response
        body = services.connect(code=code)
        status = 200
    except:

        # Some error with the table
        body = {}
        status = 500

    return {
        'statusCode': status,
        'body': json.dumps(body)
    }

@cors_headers
def get_devices_by_owner(event, context):

    user = event['queryStringParameters']

    # Return the response -- call the device service
    return {
        'statusCode': 200,
        'body': json.dumps(services.get_devices(user=user))
    }

@cors_headers
def remove_device(event, context):

    body = json.loads(event['body'])

    # Call the device service
    services.delete_device(code=body['code'], owner=body['owner'])

    # Send the response
    return {
        'statusCode': 200
    }