# codius-smart-sharing
Repository for web/mobile application dealing with smart sharing of devices using codius smart contracts to manage connections between device owners and clients.

In order to run this application, you must have an instance of moneyd and moneyd-gui running
The instance of moneyd-gui running locally must be further customized to allow CORS policies
and to parse the body of JSON requests sent with axios in the send.js file on payments.

Once the moneyd-gui instance is running, go to localhost:7770 and enable web payments.