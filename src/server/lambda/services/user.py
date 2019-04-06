import security
import dynamo_helpers

users_table = dynamo_helpers.create_dynamodb_instance('user_info')

def register_user(user):

    required_props = ['email', 'firstname', 'lastname', 'password']
    if all(user[val] and user[val] != '' for val in required_props) and not dynamo_helpers.find_if_items_exist('email', user['email'], users_table):

        # Hash the password before storing
        hashed_password = security.salt_and_hash(user['password'])
        users_table.put_item(
            Item = {
                "email": user['email'],
                'firstname': user['firstname'],
                'lastname': user['lastname'],
                'password' : hashed_password
            }
        )

        return True
    
    # Return the new user
    return False

def login(user):

    # Login a existing user if the password matches
    required_props = ['email', 'password']

    # Check that all the properties are there
    if all(user[val] and user[val] != '' for val in required_props):

        # Get the item for this email
        response = users_table.get_item(
            Key={
                "email": user['email']
            }
        )

        # Check that there was an item with this email returned
        if 'Item' not in response:

            raise KeyError()

        user_entry = response['Item']
        user_pass = response['Item']['password']

        # Check for the password matching
        if security.verify_password(user_pass, user['password']):

            # Return the user -- less the password
            del user_entry['password']
            return user_entry
        else:
            return {}
    else:

        # Properties missing -- 400 error
        raise KeyError()

def delete_user(user):

    # Remove the user from DynamoDB -- could only throw on DB connection error
    users_table.delete_item(
        Key={
            "email": user['email']
        }
    )
    return True