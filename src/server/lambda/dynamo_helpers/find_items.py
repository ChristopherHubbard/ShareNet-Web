from boto3.dynamodb.conditions import Key

def find_items_on_key(item_key, item_val, table):

    # Query the table for keys that match this value
    response = table.query(
        KeyConditionExpression=Key(item_key).eq(item_val)
    )

    # Return all the items that were found
    return response['Items']

def find_if_items_exist(item_key, item_val, table):

    if not find_items_on_key(item_key, item_val, table):

        # No items exist
        return False
    else:

        # List was not empty
        return True