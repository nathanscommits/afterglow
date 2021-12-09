
const USERS = require("../db").db().collection("USERS");
const NPC = require("../db").db().collection("NPC");
const ITEMS = require("../db").db().collection("ITEMS");
const postController = require("./post_controller");

exports.addExperience = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    //add exp to equiped spells and overall exp
}
exports.addRep = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    //loop through the req.body object to add or remove rep from each faction included
}
exports.spellLevelUp = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    //set spell level +1 if its not maxed already, reset exp needed for next level
}
exports.playerLevelUp = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    //set level +1 if its not maxed already, reset exp needed for next level
}
exports.repLevelUp = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    //set rep level, reset exp needed for next level
}
