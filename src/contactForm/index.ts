import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Handler } from "aws-lambda";
import { contactFormSchema } from "../utils/validators";
import {
  createErrorResponse,
  createSuccessResponse,
  log,
} from "../utils/returnResponse";

// ---- Constants ----
const TO_EMAIL_ADDRESS = "joaquinsw.salinas@gmail.com";
const FROM_EMAIL_ADDRESS = "contact@joaquinswears.com";
const AWS_REGION = process.env.AWS_REGION || "eu-central-1";

// ---- Initialize SES Client ----
const ses = new SESClient({ region: AWS_REGION || "eu-central-1" });

const sendEmail = async (name: string, email: string, message: string) => {
  const params = {
    Destination: {
      ToAddresses: [TO_EMAIL_ADDRESS],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                    <html>
                        <body>
                            <h1>New message from ${name}</h1>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Message:</strong></p>
                            <p>${message.replace(/\n/g, "<br>")}</p>
                        </body>
                    </html>
                `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
                    New message from ${name}
                    Email: ${email}
                    Message:
                    ${message}
                `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New message from ${name} via contact form on your website`,
      },
    },
    Source: FROM_EMAIL_ADDRESS,
  };

  await ses.send(new SendEmailCommand(params));
};

export const handler: Handler = async (event) => {
  try {
    console.log("Received Event", event);
    const body = JSON.parse(event.body);
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      log(`Validation error: ${validation.error.errors}`, "ERROR");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validation.error.errors }),
      };
    }

    const { name, email, message } = validation.data;

    console.log("body", event.body);
    log(`Received message from ${name} <${email}>: ${message}`, "INFO");
    if (!name || !email || !message) {
      log("Missing required fields", "ERROR");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Send email
    await sendEmail(name, email, message);

    return createSuccessResponse(200, { message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    if (error instanceof Error) {
      log(`Email sending error: ${error.message}`, "ERROR");
    } else {
      log(`Email sending error: ${String(error)}`, "ERROR");
    }
    return createErrorResponse(500, "Internal Server Error");
  }
};
