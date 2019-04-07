import dynamo_helpers
from boto3.dynamodb.conditions import Key, Attr

# Create a new device entry
device_table = dynamo_helpers.create_dynamodb_instance('device_info')

def register_device(device):

    required_props = ['name', 'owner', 'contractURL', 'code']

    if all(device[val] and device[val] != '' for val in required_props) and not dynamo_helpers.find_if_items_exist('code', device['code'], device_table):

        # Add the device to the table
        device_table.put_item(
            Item={
                'name': device['name'],
                'owner': device['owner'],
                'contractURL': device['contractURL'],
                'code': device['code'],
                'accessType': device['accessType'],
                'deviceCategory': device['deviceCategory']
            }
        )

        # Is the internals needed??

        # Return True on success
        return True

    elif all(val in device for val in required_props):

        # Missing props or exists
        raise KeyError()
    else:

        # Exists
        return False

def connect(code):

    response = device_table.query(
        KeyConditionExpression=Key('code').eq(code)
    )

    # Return the object with the device
    return {
        'device': response['Items'][0]
    }

def get_devices(user):

    response = device_table.scan(
        FilterExpression=Attr('owner.email').eq(user['email'])
    )

    # Restructure the device records
    devices = [createDeviceRecord(device) for device in response['Items']]

    # Return the body
    return {
        'devices': devices
    }

def get_public_devices():

    # Get all the devices that are labeled as public
    response = device_table.scan(
        FilterExpression=Attr('accessType').eq('PUBLIC')
    )

    # Restructure the device records
    devices = [createDeviceRecord(device) for device in response['Items']]

    # Return the body
    return {
        'devices': devices
    }

def delete_device(code, owner):

    device_table.delete_item(
        Key={
            "code": code
        },
        ConditionExpression=Attr('owner.email').eq(owner['email']),
    )

    return True

def createDeviceRecord(device):

    # Return a structured device record
    return {
        'name': device['name'],
        'contractURL': device['contractURL'],
        'code': device['code'],
        'owner': {
            'firstname': device['owner']['firstname'],
            'lastname': device['owner']['lastname'],
            'email': device['owner']['email']
        },
        'accessType': device['accessType'],
        'deviceCategory': device['deviceCategory']
    }