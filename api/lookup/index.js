var stringSimilarity = require('string-similarity');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { resolve } = require('path');


const serviceAccountKeyFile = "./credentials.json";

exports.handler = async (event = {}, callback = console.log) => {
  let guest = null;
  if (event.query && event.query.guest) {
    console.log("Received name: " + event.query.guest);
    guest = event.query.guest;
  }

  if(guest == null){
    callback({
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Please provide a guest name",
      })
    });
    return;
  }
  // Load client secrets from a local file.
  const guestData = await new Promise(function (resolve, reject) {
      getGuest(guest, returnSuccess(callback), returnError(callback));
  });
}

function returnSuccess(callback) {
  return response => callback({
    statusCode: 200,
    body: { guestData: response },
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000/rsvp'
    },
  });
}

function returnError(callback) {
  return error => callback({
    statusCode: 500,
    body: JSON.stringify({ error }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000/rsvp'
    },
  });
}

function cleanContact(contact = "") {
  contact = contact.toLowerCase();
  contact = contact.replace("&", "");
  contact = contact.replace("and", "");
  return contact;
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
async function getGuest(addressee, resolve, reject) {
  // auth client
  const client = await getAuthClient();

  // clean user input
  addressee = cleanContact(addressee);

  // get data
  client.spreadsheets.values.get({
    spreadsheetId: process.env.WEDDING_GUEST_SPREADSHEET_ID,
    range: "'Guests'!A1:B109",
  }, (err, res) => {
    if (err) return `The API returned an error: ${err}`;
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      const guests = rows.map((row) => {
         return cleanContact(row[0]);
      });

      const mostSimlular = stringSimilarity.findBestMatch(addressee, guests);
      if (mostSimlular.bestMatch.rating > 0.5) {
        resolve({
            rowColumns:rows[0],
            match: rows[mostSimlular.bestMatchIndex]
        });
        return;
      } else {
        resolve({
            rowColumns:rows[0],
            suggestion: rows[mostSimlular.bestMatchIndex]
        });
        return;
      }
    } else {
      reject({ error: 'no spreadsheet data' })
      return;
    }
  });
}