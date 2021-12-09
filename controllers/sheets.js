const {google} = require('googleapis');

// async function updateSheet(value) {
exports.updateSheet = async (value) => {
    try{
        const auth = new google.auth.GoogleAuth({
            projectId: "mbe-classroom",
            credentials: {
                "private_key": process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
                "client_email": process.env.CLIENT_EMAIL,
            },
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        //create client instance for auth
        const client = await auth.getClient();
    
        //create instance of google sheets api
        const googleSheets = google.sheets({ version: "v4", auth: client });
    
        const spreadsheetId = process.env.SPREADSHEETID;
    
        //write rows to sheet
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    value,
                ]
            }
        })
    } catch(e){
        console.log(e)
    }
}
// async function readSheet(range) {
exports.readSheet = async (range, spreadsheetId) => {
//   const { request, name } = req.body;

  const auth = new google.auth.GoogleAuth({
    projectId: "mbe-classroom",
    credentials: {
        "private_key": process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
    },
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Get metadata about spreadsheet
//   const metaData = await googleSheets.spreadsheets.get({
//     auth,
//     spreadsheetId,
//   });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: range, //"Sheet1!A:A"
  });

  return getRows
}