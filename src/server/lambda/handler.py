import json
import boto3
import os
import hashlib, binascii
from boto3.dynamodb.conditions import Key, Attr
from lambda_decorators import cors_headers

#User APIs
@cors_headers
def new_user(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    users_table = dynamoDB.Table('user_info')
    temp = json.loads(event['body'])
    print(temp)
    body = temp['body']
    check_arr = ['email','firstname','lastname','password']
    if all(val in body for val in check_arr) and "" not in body.values():
        user_exists = check_if_item_exists('email',body['email'],users_table)
        hashed_password = salt_hash(body['password'])
        if user_exists == False:
            response = users_table.put_item(
            Item = {
                "email": body['email'],
                'firstname': body['firstname'],
                'lastname': body['lastname'],
                'password' : hashed_password
            }
            )

    output = {}
    output['statusCode'] = 200
    output['headers'] = {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':"GET, OPTIONS, POST",
        "Allow" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers" : "*"
        
    }
    return output

@cors_headers
def login_user(event, context):
    print('here')
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    users_table = dynamoDB.Table('user_info')
    body = event['queryStringParameters']
    check_arr = ['email','password']
    if all(val in body for val in check_arr) and "" not in body.values():
        response = users_table.get_item(
            Key={
                "email": body['email']
            }
        )
        if 'Item' not in response:
            output={}
            output['statusCode'] = 409
            return output
        user = response['Item']
        user_pass = user['password']
        del user['password']

        output = {}
        output['statusCode'] = 200
        if verify_password(user_pass, body['password']):
            output['body'] = json.dumps(user)
        else:
            output['body'] = json.dumps({})
        return output
@cors_headers
def delete_user(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    users_table = dynamoDB.Table('user_info')
    body = event['queryStringParameters']
    response = users_table.delete_item(
        Key={
            "email": body['email']
        }
    )
    output = {}
    output['statusCode'] = 200
    return output

#Device APIs
@cors_headers
def new_device(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    devices_table = dynamoDB.Table('device_info')
    temp = json.loads(event['body'])
    body = temp['body']
    check_arr = ['name','owner','contractURL','code']
    output={}
    if all(val in body for val in check_arr):
        device_exists = check_if_item_exists('code',body['code'],devices_table)
        if device_exists == False:
            response = devices_table.put_item(
            Item = {
                "name": body['name'],
                'owner': body['owner'],
                'contractURL': body['contractURL'],
                'code' : body['code']
            }
            )
            ret_dev = {
                "name": body['name'],
                'owner': body['owner'],
                'contractURL': body['contractURL'],
                'code' : body['code']
            }
            output['body'] = json.dumps(ret_dev)
            output['statusCode'] = 200
            return output
    output['statusCode'] = 409
    return output
@cors_headers
def find_device_by_code(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    devices_table = dynamoDB.Table('device_info')
    body = event['queryStringParameters']
    response = devices_table.query(
        KeyConditionExpression=Key('code').eq(body['code'])
    )
    items = response['Items']
    output = {}
    output['statusCode'] = 200
    output['body'] = json.dumps({'device': items[0]})
    return output

@cors_headers
def get_devices_by_owner(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    devices_table = dynamoDB.Table('device_info')
    body = event['queryStringParameters']
    email = body['email']
    response = devices_table.scan(
        FilterExpression=Attr('owner.email').eq(email)
    )
    items = response['Items']
    devices = []
    for each in items:
        temp={'name':each['name'],'contractURL':each['contractURL'], 'code':each['code'], 'owner':{'firstname':body['firstname'], 'lastname':body['lastname'],'email':body['email']}}
        devices.append(temp)
    output = {}
    output['statusCode'] = 200
    output['body']= json.dumps({'devices': devices})
    return output

@cors_headers
def remove_device(event, context):
    dynamoDB = boto3.resource('dynamodb',region_name='us-east-2')
    devices_table = dynamoDB.Table('device_info')
    body = json.loads(event['body'])
    code = body['code']
    print(body['code'])
    dev_owner = body['owner']
    email = dev_owner['email']
    response = devices_table.delete_item(
        Key={
            "code": code
        },
        ConditionExpression= Attr('owner.email').eq(email),
    )
    output = {}
    output['statusCode'] = 200
    return output



#Helper Functions
def salt_hash(password):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), 
                                salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password, provided_password):
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha512', 
                                  provided_password.encode('utf-8'), 
                                  salt.encode('ascii'), 
                                  100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password

def check_if_item_exists(item_key,item_val, table):
    response = table.query(
        KeyConditionExpression=Key(item_key).eq(item_val)
    )
    items = response['Items']
    if items == []:
        return False
    else:
        return True



