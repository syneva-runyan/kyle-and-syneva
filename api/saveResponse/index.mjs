import stringSimilarity from 'string-similarity';
import { google } from 'googleapis';
import aws from 'aws-sdk';
var ses = new aws.SES({region: 'us-east-1'});

const serviceAccountKeyFile = "./credentials.json";


export const handler =  async (event) => {
    let guestResponses = null;
    if (event.body && event.body.name) {
      console.log("Received rsvp for party: " + event.body.name);
      if (!event.body.partyMembers || !Array.isArray(event.body.partyMembers) ||  event.body.partyMembers.length == null) {
        return returnError("No guest Response provided");
      }
      guestResponses = event.body.partyMembers;
      const res = await saveResponseInSpreadsheet(guestResponses);
      // we update the spreadsheet as people are going through pages in a form
      // but we only want to save the confirmation when the user's finished the full rsvp.
      if(event.body.finishedRSVP) {
        try {
            await sendConfirmationEmail(guestResponses)
        } catch (error){
            // silent failure :( 
            // if this was legit code i'd log the error somewhere.
            return res
        }
      }
      return res;
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


async function saveResponseInSpreadsheet(partyMemberResponses) {
    // auth client
    const client = await getAuthClient();

    console.log("looking up existing rsvp information...")

    // get row for partyMember
    const res = await client.spreadsheets.values.get({
      spreadsheetId: process.env.WEDDING_GUEST_SPREADSHEET_ID,
      range: "'Guests'!A2:K146",
    })

    if (res.status !== 200) {
        return returnError(`The API returned an error when trying to get party rows`);
    }

    console.log("successfully fetch rsvp data")

    const rows = res.data.values;
    const guestNames = rows.map((row) => {
        // first name, last name
      return `${row[1]} ${row[2]}`;
    });

    const updateData = []

    partyMemberResponses.forEach(partyMember => {
      const mostSimlular = stringSimilarity.findBestMatch(partyMember.name, guestNames);

      let values = [[]];

      // clear all spreadsheet values prior set if person is no longer attending.
      if (partyMember.attending == false) {
        values = [[
          partyMember.attending,
          "",
          "",
          "",
          "",
          "",
          ""
        ]]
      } else {
        values = [[
          partyMember.attending,
          partyMember.eventsAttending["Thursday evening dinner and event"] || rows[mostSimlular.bestMatchIndex][5],
          partyMember.eventsAttending["Friday afternoon lunch and activity"] || rows[mostSimlular.bestMatchIndex][6],
          partyMember.eventsAttending["Friday evening and activity dinner"] || rows[mostSimlular.bestMatchIndex][7],
          partyMember.eventsAttending["Saturday wedding and reception"] || rows[mostSimlular.bestMatchIndex][8],
          partyMember.foodPreferences || rows[mostSimlular.bestMatchIndex][9],
          partyMember.stayingOnsite || rows[mostSimlular.bestMatchIndex][10] || "no"
        ]]
    }
    const guestRow = mostSimlular.bestMatchIndex + 2;

    updateData.push({
      "majorDimension": "ROWS",
      "values":values,
      "range": `E${guestRow}:K${guestRow}`
    })
  })


  const setResp = await client.spreadsheets.values.batchUpdate({
    "spreadsheetId": process.env.WEDDING_GUEST_SPREADSHEET_ID,
    requestBody: {
      "valueInputOption": "RAW",
      "includeValuesInResponse": false,
      "data": updateData,
    }
  });

  if (setResp.status !== 200) {
      return returnError("Could not save answers to spreadsheet");
  };

  console.log(`successfully updated spreadsheet`)
  return returnSuccess()
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

async function sendConfirmationEmail(guestRSVP = {}) {
      const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>New Reservation from the ${guestResponse.name} party.</p>
        <p>${JSON.stringify(guestRSVP)}.</p>
      </body>
    </html>
  `;

  const textBody = `
    New Reservation from ${guestResponse.name},
    ${JSON.stringify(guestRSVP)}
  `;

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: ['syneva@gmail.com', "kyle0007@gmail.com", "kyleandsyneva@gmail.com"]
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
        Data: `Wedding RSVP for ${guestResponse.name}!`
      }
    },
    Source: "Kyle and Synevas Site <syneva@gmail.com>"
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("MAIL SENT SUCCESSFULLY!!");      
  } catch (e) {
    console.log("FAILURE IN SENDING MAIL!!", e);
  }  
  return;
}