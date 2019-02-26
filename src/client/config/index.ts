// Export default url config -- ideally would be dependentent on env variables

// Set the exported config based on the current env here
const allConfigs: any = 
{
    LOCAL: 
    {
        apiUrl: 'http://localhost:8000'
    },
    DEV:
    {
        apiUrl: 'https://8k3zb9t689.execute-api.us-east-2.amazonaws.com/dev'
    },
    PROD:
    {
        apiUrl: ''
    }
};

let config: any = allConfigs['DEV'];

export default config;