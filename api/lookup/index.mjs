import stringSimilarity from 'string-similarity';
import { google } from 'googleapis';


const serviceAccountKeyFile = "./credentials.json";


export const handler =  async (event) => {
  let guest = null;
  if (event.queryStringParameters && event.queryStringParameters.guest) {
    console.log("Received name: " + event.queryStringParameters.guest);
    guest = event.queryStringParameters.guest;
  }

  if(guest == null){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Please provide a guest name",
      })
    };
  }
  // Load client secrets from a local file.
  const guestLookup = await getGuests(guest);
  return guestLookup
}

function returnSuccess(guestData) {
  return {
    statusCode: 200,
    body: JSON.stringify({ guestData: guestData }),
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",

    },
  };
}

function returnError(error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function cleanContact(contact = "") {
  contact = contact.toLowerCase();
  contact = contact.replace("&", "");
  contact = contact.replace("and", "");
  return contact;
}

// print names of other people in party
function findPartyMembers(guests, partyName) {
  const partyMembers = guests.filter(guestData => (
    guestData[0] == partyName
  ))

  return partyMembers.map(guest => {
    console.log(guest);
    console.log(guest[4].toLowerCase() == "false" ? false: true);
    return {
      name: `${guest[1]} ${guest[2]}`,
      isAdult: guest[3] == 1,
      attending: (guest[4]?.toLowerCase() == "false" ? false: true),
      eventsAttending: {
        "Thursday evening dinner and event": (guest[5] && (guest[5].toLowerCase() == "false" ? false: true)) ||  false,
        "Friday afternoon lunch and activity": (guest[6] && (guest[6].toLowerCase() == "false" ? false: true)) ||  false,
        "Friday evening and activity dinner": (guest[7] && (guest[7].toLowerCase() == "false" ? false: true)) ||  false,
        "Saturday wedding and reception": (guest[8] && (guest[8].toLowerCase() == "false" ? false: true)) ||  false
      },
      foodPreferences: guest[9] || "",
      stayingOnsite: guest[10] || "no",
    }
  })
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

/**
 * Prints the rows of the wedding RSVP spreadsheet
 */
async function getGuests(addressee, resolve, reject) {
  // auth client
  const client = await getAuthClient();

  // clean user input
  addressee = cleanContact(addressee);

  // get data
  const spreadsheetDataResponse = await client.spreadsheets.values.get({
    spreadsheetId: process.env.WEDDING_GUEST_SPREADSHEET_ID, 
    range: "'Guests'!A2:K146",
  });

  if(spreadsheetDataResponse.status !== 200) {
    return returnError(`The API returned an error: ${err}`);
  }
  console.log("Successfully fetched guest data");


  const rows = spreadsheetDataResponse.data.values;
  if (rows.length) {
    const guests = rows.map((row) => {
        // first name, last name, party
        return cleanContact(row[0]);
    });

    const mostSimlular = stringSimilarity.findBestMatch(cleanContact(addressee), guests);
    const mostSimlularParty = {
        name: rows[mostSimlular.bestMatchIndex][0],
        partyMembers: findPartyMembers(rows, rows[mostSimlular.bestMatchIndex][0])
    }
    if (mostSimlular.bestMatch.rating > 0.5) {
      return returnSuccess({
          match: mostSimlularParty
      });
    } else {
      return returnSuccess({
          suggestion: mostSimlularParty
      });
    }
  } else {
    return returnError({ error: 'no spreadsheet data' })
  }
}