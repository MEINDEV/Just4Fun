const { EmailClient } = require("@azure/communication-email");
const { DefaultAzureCredential } = require("@azure/identity");
const { app } = require('@azure/functions'); 

const endpoint = "https://meind-smtp-server.india.communication.azure.com";
const credential = new DefaultAzureCredential();
const client = new EmailClient(endpoint, credential);

app.http('handleEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        context.log(`Processing email request for "${request.url}"`);

        // 1. Get the recipient from the JSON body
        // Expecting JSON: { "email": "user@example.com", "name": "John" }
        const data = await request.json();
        const recipientEmail = data.email;
        const recipientName = data.name || 'Customer';

        const message = {
            senderAddress: "AMT_noreply@meindev.com",
            content: { subject: "Test Email", plainText: "Hello world!" },
            recipients: { to: [{ address: recipientEmail }] },
        };

        if (!recipientEmail) {
            return { status: 400, body: "Missing recipient email in request body." };
        }

        const poller = await client.beginSend(message);
        const result = await poller.pollUntilDone();
        console.log("Sent successfully:", result);

    }
});