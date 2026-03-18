const { app } = require('@azure/functions');
const nodemailer = require('nodemailer');

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

        if (!recipientEmail) {
            return { status: 400, body: "Missing recipient email in request body." };
        }

        // 2. Configure the Transporter using Environment Variables
        const transporter = nodemailer.createTransport({
            host: "smtp.azurecomm.net", // Or your SMTP provider
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "PQ0CxptgU6NH3uvvzZrR",
                pass: process.env.AZURE_CLIENT_SECRET,
            },
        });

        try {
            // 3. Send the email
            const info = await transporter.sendMail({
                from: `"My Azure App" <${"AMT_noreply@meindev.com"}>`,
                to: recipientEmail,
                subject: "Hello from Azure Functions!",
                text: `Hello ${recipientName}, this is a test email sent via your Azure API!`,
                html: `<b>Hello ${recipientName}</b>, this is a test email sent via your Azure API!`,
            });

            context.log("Message sent: %s", info.messageId);
            return { status: 200, body: JSON.stringify({ message: "Email sent successfully!" }) };
            
        } catch (error) {
            context.log.error("Email error:", error);
            return { status: 500, body: "Failed to send email." };
        }
    }
});