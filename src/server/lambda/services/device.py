import dynamo_helpers
from boto3.dynamodb.conditions import Key, Attr

def register_device(device):

    # Create a new device entry
    device_table = dynamo_helpers.create_dynamodb_instance('device_info')

    required_props = ['name', 'owner', 'contractURL', 'code']

    if all(device[val] and device[val] != '' for val in required_props) and not dynamo_helpers.find_if_items_exist('code', device['code'], device_table):

        # Add the device to the table
        device_table.put_item(
            Item={
                'name': device['name'],
                'owner': device['owner'],
                'contractURL': device['contractURL'],
                'code': device['code']
            }
        )

        # Is the internals needed??

        # Return the Device? -- This should probably have a refactor to stay the same as register user
        return True, {
            'name': device['name'],
            'owner': device['owner'],
            'contractURL': device['contractURL'],
            'code': device['code']
        }

    elif all(val in device for val in required_props):

        # Missing props or exists
        raise KeyError()
    else:

        # Exists
        return False, {}

def connect(code):

    # Connect to the device with this connection code
    device_table = dynamo_helpers.create_dynamodb_instance('device_info')

    response = device_table.query(
        KeyConditionExpression=Key('code').eq(code)
    )

    # Return the object with the device
    return {
        'device': response['Items'][0]
    }

def get_devices(user):

    # Get all this users devices
    device_table = dynamo_helpers.create_dynamodb_instance('device_info')

    response = device_table.scan(
        FilterExpression=Attr('owner.email').eq(user['email'])
    )

    # Restructure the device records
    devices = [createDeviceRecord(device, user) for device in response['Items']]

    # Return the body
    return {
        'devices': devices
    }

def delete_device(code, owner):

    # Delete this device if owned by the owner
    device_table = dynamo_helpers.create_dynamodb_instance('device_info')

    device_table.delete_item(
        Key={
            "code": code
        },
        ConditionExpression=Attr('owner.email').eq(owner['email']),
    )

    return True

def createDeviceRecord(device, user):

    # Return a structured device record
    return {
        'name': device['name'],
        'contractURL': device['contractURL'],
        'code': device['code'],
        'owner': {
            'firstname': user['firstname'],
            'lastname': user['lastname'],
            'email': user['email']
        }
    }