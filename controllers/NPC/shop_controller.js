const USERS = require("../../db").db().collection("USERS");
const NPC = require("../../db").db().collection("NPC");
const ITEMS = require("../../db").db().collection("ITEMS");
const postController = require("../post_controller");

//display inventory of items with price infomation (info from spreadsheet)

//varry prices based on rep

//varry available items based on rep/missions completed

//deliver purchased items to player (check they have enough currency)

//take currency for purchased items from player