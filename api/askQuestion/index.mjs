import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


export const handler =  async (event) => {
    const body = JSON.parse(event.body)
    if (body && body.from) {
      console.log("Received comment or question for party: " + body.from);
        try {
            return await sendEmail(body);
        } catch (error){
          return returnError("Something went wrong, please try again later.");
        }
    }
    return returnError("Check your request body and try again.");
};

function returnSuccess() {
  return  {
    statusCode: 200,
    body: JSON.stringify({ "success": "ok" }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
}

function returnError(errorStr) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: errorStr }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
}

async function sendEmail(guestCommentOrQuestion = {}) {
      const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Comment or Question from the ${guestCommentOrQuestion.from} party.</p>
        <p>${JSON.stringify(guestCommentOrQuestion.body)}.</p>
      </body>
    </html>
  `;
  
  console.log("composed htmlBody");

  const textBody = `
    New Comment or Question from ${guestCommentOrQuestion.from},
    ${JSON.stringify(guestCommentOrQuestion)}
  `;
  
    console.log("composed textBody");


  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: ['syneva@gmail.com', 'kyleandsyneva@gmail.com']
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "🤵👰 Wedding Comment or Question Question from ${guestCommentOrQuestion.from}!"
      }
    },
    Source: "kyleandsyneva@gmail.com"
  };

  console.log("creating email client...")
  const client = new SESClient({ region: 'us-east-1' });


  try {
    const command = new SendEmailCommand(params);
    const response = await client.send(command); 
    console.log("Successfully sent email");  
  } catch (e) {
    console.log("FAILURE IN SENDING MAIL!!", e);
    return returnError("failed to send email")
  }  
  return returnSuccess();
}