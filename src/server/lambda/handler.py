import json
from lambda_decorators import cors_headers

# Imports from services packages
import services

@cors_headers
def new_device(event, context):

    device = json.loads(event['body'])['body']

    # Call the device service
    try:
        succeeded = services.register_device(device=device)

        if succeeded:

            status = 200
        else:

            status = 409
    except:

        status = 409

    # Return the response
    return {
        'statusCode': status
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
def get_public_devices(event, context):

    return {
        'statusCode': 200,
        'body': json.dumps(services.get_public_devices())
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

@cors_headers
def update_device_info(event, context):

    # Update the device info -- this can update the name, category, accesstype, and contract URL. Cannot update the connection code
    body = json.loads(event['body'])['body']
    print(body)

    try:
        # Call device service to updaate
        services.update_device(code=body['code'], update_body=body)
        statusCode = 200
    except:
        print('Error updating a device - is it owned by the caller?')
        statusCode = 400

    return {
        'statusCode': statusCode
    }