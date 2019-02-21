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
        apiUrl: ''
    },
    PROD:
    {
        apiUrl: ''
    }
};

let config: any = allConfigs['LOCAL'];

export default config;