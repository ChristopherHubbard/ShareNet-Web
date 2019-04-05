// Export default url config -- ideally would be dependentent on env variables

// Set the exported config based on the current env here
const allConfigs: any = 
{
    LOCAL: 
    {
        apiUrl: 'http://localhost:8000',
        moneydUrl: 'http://localhost:8081',
        cognito: {
            REGION: 'us-east-2',
            USER_POOL_ID: 'us-east-2_dXzoq9vL3',
            APP_CLIENT_ID: '3ef6fitjfku707tu30esnuhqj7'
        }
    },
    DEV:
    {
        apiUrl: 'https://70es1m90b3.execute-api.us-east-2.amazonaws.com/dev',
        moneydUrl: 'http://localhost:8081',
        cognito: {
            REGION: 'us-east-2',
            USER_POOL_ID: 'us-east-2_dXzoq9vL3',
            APP_CLIENT_ID: '3ef6fitjfku707tu30esnuhqj7'
        }
    },
    PROD:
    {
        apiUrl: '',
        moneydUrl: '',
        cognito: {}
    }
};

let config: any = allConfigs['DEV'];

export default config;