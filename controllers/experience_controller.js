
const USERS = require("../db").db().collection("USERS");
const NPC = require("../db").db().collection("NPC");
const ITEMS = require("../db").db().collection("ITEMS");
const postController = require("./post_controller");

exports.addExperience = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
}
exports.addRep = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
}
exports.spellLevelUp = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
}
exports.repLevelUp = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
}
