let payment_request_event: any;
let payment_request_resolver: any;


self.addEventListener('canmakepayment', (e: any) =>
{
    e.responseWith(true);
});

self.addEventListener('paymentrequest', async (e: any) =>
{
    payment_request_event = e;

    // The methodData here represents what the merchant supports. We could have a
    // payment selection screen, but for this simple demo if we see interledger in the list
    // we send the user through the interledger flow.
    let url = self.location.origin + '/interledger.html'
    if (e.methodData[0].supportedMethods !== 'interledger')
    {
        console.log('Interledger not supported');
        return false;
    }

    await e.respondWith({
        methodName: e.methodData[0].supportedMethods,
        details: e.total
    });
});