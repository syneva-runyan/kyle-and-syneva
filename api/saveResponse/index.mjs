import stringSimilarity from 'string-similarity';
import { google } from 'googleapis';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


const serviceAccountKeyFile = "./credentials.json";


export const handler =  async (event) => {
    let body = event.body;
    if (typeof body === 'string') {
      console.log("converting body to string");
      body = JSON.parse(body);
    }
    if (body && body.name) {
      console.log("Received rsvp for party: " + body.name);
      if (!body.partyMembers || !Array.isArray(body.partyMembers) ||  body.partyMembers.length == null) {
        return returnError("No guest Response provided");
      }
      const guestResponses = body.partyMembers;
      const questionIndex = body.questionIndex;
      const res = await saveResponseInSpreadsheet(guestResponses, questionIndex);
      // we update the spreadsheet as people are going through pages in a form
      // but we only want to save the confirmation when the user's finished the full rsvp.
      if(body.finishedRSVP) {
        console.log("sending confirmation email");
        try {
            await sendConfirmationEmail(body)
        } catch (error){
            console.log("error sending confirmation email", error)
            // silent failure :( 
            // if this was legit code i'd log the error somewhere.
            return res
        }
      }
      return res;
    }
    console.log("got here unexpectly", event);
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

function getEventAttendance(eventName, eventsAttending, currentResponse, questionIndex) {
  if(questionIndex == 0) {
    return currentResponse;
  }
  if(eventsAttending[eventName]) {
    return eventsAttending[eventName].toString();
  }
  if (currentResponse) {
    return currentResponse.toString()
  }
  
  return "false";
}

function getStayingOnSite(updatedResponse, existingResponse, questionIndex) {
  if(questionIndex < 2) {
    return existingResponse;
  }

  return updatedResponse || "no";
}

async function saveResponseInSpreadsheet(partyMemberResponses, questionIndex) {
    // auth client
    const client = await getAuthClient();

    console.log("looking up existing rsvp information...")

    // get row for partyMember
    const res = await client.spreadsheets.values.get({
      spreadsheetId: process.env.WEDDING_GUEST_SPREADSHEET_ID,
      range: "'Guests'!A2:K148",
    });

    if (res.status !== 200) {
        return returnError(`The API returned an error when trying to get party rows, ${err}`);
    }

    console.log("successfully fetched rsvp data")

    const rows = res.data.values;
    const guestNames = rows.map((row) => {
        // first name, last name
      return `${row[1]} ${row[2]}`;
    });

    const updateData = []

    partyMemberResponses.forEach(partyMember => {
      const mostSimlular = stringSimilarity.findBestMatch(partyMember.name, guestNames);
      console.log(`compiling response for ${rows[mostSimlular.bestMatchIndex]}`);
      console.log(partyMember);
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
          partyMember.attending || "false",
          getEventAttendance("Thursday evening dinner and welcome party", partyMember.eventsAttending, rows[mostSimlular.bestMatchIndex][5], questionIndex),
          getEventAttendance("Friday afternoon lunch and activity", partyMember.eventsAttending, rows[mostSimlular.bestMatchIndex][6], questionIndex),
          getEventAttendance("Friday evening rehersal dinner and drinks", partyMember.eventsAttending, rows[mostSimlular.bestMatchIndex][7], questionIndex),
          getEventAttendance("Saturday wedding and reception", partyMember.eventsAttending, rows[mostSimlular.bestMatchIndex][8], questionIndex),
          partyMember.foodPreferences || rows[mostSimlular.bestMatchIndex][9],
          getStayingOnSite(partyMember.stayingOnsite, rows[mostSimlular.bestMatchIndex][10], questionIndex)
        ]]
    }
    const guestRow = mostSimlular.bestMatchIndex + 2;

    updateData.push({
      "majorDimension": "ROWS",
      "values":values,
      "range": `E${guestRow}:K${guestRow}`
    })
  })

  console.log("updating spreadsheet with new responses");

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

async function sendConfirmationEmail(guestRSVP = { name: ""}) {
  const guestResponsesString = guestRSVP.partyMembers.map((member) => {
    let details = "";
    if(member.attending) {
      details = `<p>Events Attending:</p>
      <ul>
        ${Object.keys(member.eventsAttending).map((eventName) => {
          return `<li>${eventName}: ${member.eventsAttending[eventName]}</li>`
        })}
      </ul>
      <p>Staying Onsite: ${member.stayingOnsite}</p>`
    }
    return `
      <p>${member.name} is ${member.attending ? "attending" : "not attending"}</p>
      ${details}`
  }).join("");

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>New Reservation from the ${guestRSVP.name} party.</p>
        ${guestResponsesString}
      </body>
    </html>
  `;

  console.log("composed htmlBody");

  const textBody = `
    New Reservation from ${guestRSVP.name},
    ${JSON.stringify(guestRSVP)}
  `;

  console.log("composed textBody");

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: ['syneva@gmail.com', "kyleandsyneva@gmail.com",]
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
        Data: `🤵👰 Wedding RSVP for ${guestRSVP.name}!`
      }
    },
    Source: "kyleandsyneva@gmail.com"
  };

  console.log("creating email client...")
  const client = new SESClient({ region: 'us-east-1' });


  try {
    const command = new SendEmailCommand(params);
    await client.send(command); 
    console.log("Succesfully sent confirmation email");  
  } catch (e) {
    console.log("FAILURE IN SENDING MAIL!!", e);
  }  
  return;
}