var AWS = require('aws-sdk');

exports.handler = async (event, context, call) => {
    event = event.queryStringParameters;
    let S3 = new AWS.S3({ region: process.env.AWS_REGION });
    
    var payload = {
        ...event
    }

   var params = {
         Bucket: 'katie-and-brians-wedding',
         Key: event.guestName+'.txt',
         Body: JSON.stringify(payload),
         ContentType: 'text/plain',
    };
     
    try {
        let s3Response = await S3.upload(params).promise();

        let res = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
            'body': JSON.stringify({
                "guestName": event.guestName,
                "path": event.path,
                "s3Path":s3Response.Location,
            })
        }
        
        sendConfirmationEmail(event)
        
        return res; 

    } catch (error){
        
        let fail = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
            'body': JSON.stringify({
                "error":error
            })
        }

        return fail;
    }
};

function sendConfirmationEmail(guestResponse = {}) {
      const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>New Reservation from ${guestResponse.guestName},</p>
        <p>Attending? ${guestResponse.attending ? 'Yes' : 'No'}.</p>
        <p>Guest count: ${guestResponse.guestsAttending}</p>
      </body>
    </html>
  `;

  const textBody = `
    New Reservation from ${guestResponse.guestName},
    Attending? ${guestResponse.attending ? 'Yes' : 'No'}.  Guest count: ${event.guestsAttending}
  `;

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: ['syneva@gmail.com']
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
        Data: "Wedding RSVP!"
      }
    },
    Source: "Katie and Brians Site <syneva@gmail.com>"
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(data => {
      console.log(data.MessageId);
      context.done(null, "Success");
    })
    .catch(err => {
      console.error(err, err.stack);
      context.done(null, "Failed");
    });
}