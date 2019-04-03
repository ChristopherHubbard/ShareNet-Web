import json
from lambda_decorators import cors_headers

# Imports from user packages
import services

@cors_headers
def new_user(event, context):

    # Create the Dynamo Instance
    user = json.loads(event['body'])['body']

    output = {}
    # Call the registration on the user service
    if not services.register_user(user=user):

        # Registration failed
        output['statusCode'] = 500
    else:

        # Registration success
        output['statusCode'] = 200

    # Set the output as successful
    return output

@cors_headers
def login_user(event, context):

    # Get the user data
    user = event['queryStringParameters']

    # Call the user service
    output = {}
    try:
        output['body'] = services.login(user=user)
        output['statusCode'] = 200
    except:

        # There was an error -- use code 409?
        output['statusCode'] = 409

    return output

@cors_headers
def delete_user(event, context):

    # Get the user data
    user = event['queryStringParameters']

    output = {}
    try:
        services.delete_user(user=user)
        output['statusCode'] = 200
    except:

        # Some error on delete -- return 500
        output['statusCode'] = 500

    return output

#Device APIs
@cors_headers
def new_device(event, context):

    device = json.loads(event['body'])['body']

    output = {}

    # Call the device service
    try:
        succeeded, ret_dev = services.register_device(device=device)

        if succeeded:

            output['body'] = ret_dev
            output['statusCode'] = 200
        else:

            output['statusCode'] = 409
    except:
        output['statusCode'] = 409

    # Return the response
    return output

@cors_headers
def find_device_by_code(event, context):

    # Extract the code
    code = event['queryStringParameters']['code']

    # Call the connection service
    output = {}
    try:
        # Set the response
        output['body'] = services.connect(code=code)
        output['statusCode'] = 200
    except:

        # Some error with the table
        output['statusCode'] = 500

    return output

@cors_headers
def get_devices_by_owner(event, context):

    user = event['queryStringParameters']

    # Call the device service
    output = {}
    output['statusCode'] = 200
    output['body']= services.get_devices(user=user)

    # Return the response
    return output

@cors_headers
def remove_device(event, context):

    body = json.loads(event['body'])

    # Call the device service
    services.delete_device(code=body['code'], owner=body['owner'])

    # Send the response
    output = {}
    output['statusCode'] = 200
    return output