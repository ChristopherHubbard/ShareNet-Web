// Export default url config -- ideally would be dependentent on env variables

// Set the exported config based on the current env here
const allConfigs: any = 
{
    LOCAL: 
    {
        apiUrl: 'http://localhost:8080'
    },
    DEV:
    {
        apiUrl: ''
    },
    PROD:
    {
        apiUrl: ''
    }
};

let config: any;

if (typeof process.env.ENV === 'string')
{
    config = allConfigs[process.env.ENV];
}

export default config;