import os
import hashlib, binascii

# Method to salt and hash a password -- may be deprecated due to Cognito
def salt_and_hash(password):

    # Create salt
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')

    # Create the hash value
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)

    # Return salt + hash decoded as ascii
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