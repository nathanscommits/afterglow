
const USERS = require("../../db").db().collection("USERS");
const NPC = require("../../db").db().collection("NPC");
const ITEMS = require("../../db").db().collection("ITEMS");
const postController = require("../post_controller");

// greetings/basic responses (could this be computed in world?)

// directions (get a list of landmarks, compile a spreadsheet of NPCs with direction info)

// help text (search for keywords, match keywords to a database of answers to FAQs)

//remember who NPC has met before (database of interactions and rep)

//treat players differentyly based on rep

//react to insults

//secret phrases (spreadsheet of phrases that give particular answers to progress misssions or other hidden things)