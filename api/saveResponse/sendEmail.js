// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

const guestResponse = {
    guestsAttending: 2,
    attending: true,
    guest1Food: 'Beef',
    guest1Name: "Kyle",
    guest2Food: 'Beef',
    guest2Name: "Syneva"
};

let guestInfo = "";
if(guestResponse.attending) {
    [...Array(parseInt(guestResponse.guestsAttending)).keys()].forEach(j => {
        const i = j + 1;
        guestInfo += (
            `<p>${guestResponse[`guest${i}Food`]} (${guestResponse[`guest${i}Name`]})</p>`
        )
    });
}

const guestsAttending = guestResponse.attending ? `
    <p>Guest count: ${guestResponse.guestsAttending}</p>
    ${guestInfo}
    ` : '';

const htmlBody = `
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <p>New Reservation from ${guestResponse.guestName},</p>
    <p>Attending? ${guestResponse.attending ? 'Yes' : 'No'}.</p>
    ${guestsAttending}
  </body>
</html>
`;

const textBody = `
    New Reservation from ${guestResponse.guestName},
    Attending? ${guestResponse.attending ? 'Yes' : 'No'}.  Guest count: ${guestResponse.guestsAttending}
  `;


// Create sendEmail params 
var params = {
  Destination: { /* required */
    ToAddresses: [
      'syneva@gmail.com',
      /* more items */
    ]
  },
  Message: { /* required */
    Body: { /* required */
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
      Charset: 'UTF-8',
      Data: 'New Wedding RSVP!'
     }
    },
  Source: 'syneva@gmail.com',
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });