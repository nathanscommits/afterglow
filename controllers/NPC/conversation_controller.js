
const USERS = require("../../db").db().collection("USERS");
const NPC = require("../../db").db().collection("NPC");
// const ITEMS = require("../../db").db().collection("ITEMS");
// const postController = require("../post_controller");

const {google} = require('googleapis');
async function updateSheet(value) {
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
async function readSheet(range) {
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

  const spreadsheetId = process.env.SPREADSHEETID;

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

// greetings/basic responses (could this be computed in world? ~ no benefits since each message needs a http req anyway)

// directions (get a list of landmarks, compile a spreadsheet of NPCs with direction info)

// help text (search for keywords, match keywords to a database of answers to FAQs)

//react to insults

//secret phrases (spreadsheet of phrases that give particular answers to progress misssions or other hidden things)

//remember who NPC has met before (database of interactions and rep)

//treat players differentyly based on rep


exports.responses = async (req, res) => {
    //recieve message, grab relevant spreadsheet data, check for matches, send results
    const rejected = ["I don't understand..."]
    const user = await USERS.findOne({uuid: req.body.uuid})
    if(!user) res.send("You're not registered here...")
    const npcInfo = await NPC.findOne({name: req.body.npc})
    if(!npcInfo) res.send("I'm not a registered NPC...")

    
    
    console.log(req.body)
    // const message = req.params.message
    // const npc = "example npc"
    const message = req.body.message.replace(/[^\w\s!?]/g, '');
    const messageArr = message.split(" ");
    const npc = req.body.npc
    const data = (await readSheet(`${npc}!A:I`)).data.values.slice(1)
    let response = [];
    if(npcInfo.met.includes(req.body.name)) {
        response.push(npcInfo.introduction)
        NPC.updateOne({name: req.body.npc}, {$push: {met: req.body.name}}, {upsert: true});
    }
    // console.log(message)
    data.forEach(row => { //loop rows
        // if(row[0] == "KEYWORDS") return;
        // console.log(row)
        const rowStr = row[0] + '';
        const rowArr = rowStr.toLowerCase().split(",")
        rowArr.forEach(phrase => {
            // console.log(phrase.trim())
            if( !message.includes(phrase.trim()) ) return
            //add response if response isnt already in array of responses
            const reply = row[1];
            if(response.includes(reply)) return;

            //filter criteria (min/max rep, race, min/max level, start/end time)
            if(row[2] && row[3]) {
                // console.log("filtering rep")
                const minRepFilter = JSON.parse(row[2])
                const maxRepFilter = JSON.parse(row[3])
                for (const key in minRepFilter) {
                    if(parseInt(user.factions[key].rep) < parseInt(minRepFilter[key])) return;
                }
                for (const key in maxRepFilter) {
                    if(parseInt(user.factions[key].rep) > parseInt(maxRepFilter[key])) return;
                }
            }
            if(row[4]) {
                // console.log("filtering race")
                const raceFilter = row[4].replace(/\s/g, '').split(",")
                if(!raceFilter.includes(user.race)) return;
            }
            if(row[5] && row[6]) {
                // console.log("filtering level")
                if(parseInt(row[5]) > user.level || parseInt(row[6]) < user.level) return;
            }
            if(row[7] && row[8]) {
                // console.log("filtering time")
                req.body.timestamp = parseInt(req.body.timestamp)
                if((row[7] && row[8]) && (row[7] > req.body.timestamp || row[8] < req.body.timestamp)) return; //checks time
            }

            // console.log("adding: " + reply)
            response.push(reply)
            
        })
    });

    if(!response.length) response = rejected;

    // console.log(data)
    res.send(response)
}