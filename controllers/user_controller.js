
const USERS = require("../db").db().collection("USERS");
const NPC = require("../db").db().collection("NPC");
const postController = require("./post_controller");
const sheets = require("./sheets")

exports.registerUser = (req, res) => {
    // add starter stats
    let user = {
        ...req.body,
        ecto: 100,
        ecto_max: 100,
        ap: 100,
        ap_max: 100,
        bone: 0,
        factions: {
            phantom: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            demon: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            cryptid: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            doa: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            mob: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            locals: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
            cult: {
                rep: 0,
                rank: 0,
                missions: 0,
            },
        },
        plasm: {
            consumed: 0,
            last: new Date(),
            toxicity: 0,
        },
        kills: {
            hatmen: 0,
            goons: 0,
            players: 0,
            npc: 0,
        },
        deaths: {
            hatmen: 0,
            goons: 0,
            players: 0,
            diminished: 0,
            npc: 0,
        },
        skills: {

        },
        inventory_size: 15,
        inventory: [],
        bank_size: 30,
        bank: [],
        bone_bank: 0,
        trade_log: [],
        effects: [],
        stat_buffs: {
            cost: 1,
            power: 1,
            crit: 1,
            range: 1,
            duration: 1,
            cooldown: 1,
            ecto_max: 1,
            ap_max: 1,
            impulse: 1,
            resistance: 1,
            reflected: 1,
        },
        combat: {
            cooldown: {
                1: 0, 
                2: 0, 
                3: 0, 
                4: 0, 
                5: 0
            },
            target: 'none',
            silenced: false,
            taunt_target: '',
            damage_split_target: '',
            assault_time: new Date(),
            cheat_death_time: new Date(),
        },
    }
    USERS.insertOne(user);
    res.send(user);
}

exports.getAllUsers = async (req, res) => {
    let user = await USERS.find().toArray();
    console.log(user)
    if(user)
        res.send(user);
    else 
        res.send("no user exists")
}
exports.getUser = async (req, res) => {
    let user = await USERS.findOne({uuid: req.body.uuid});
    console.log(user)
    if(user)
        res.send(user);
    else 
        res.send("no user exists")
}
exports.updateUser = async (req, res) => {
    //update the stats of a user
    /* stats to not edit: 
        uuid, bank, trade_log, skill bank
    */
   try{
    // let user = await USERS.findOne({uuid: req.body.uuid});

    // let updated = Object.assign(user, req.body);
    // console.log(updated)
    USERS.updateOne({uuid: req.body.uuid}, {$set: req.body}, { upsert: true })
    res.send("updated")
   }catch(e){
       console.log(e)
   }
}
exports.updateUrl = async (req, res) => {
    //update the stats of a user
    /* stats to not edit: 
        uuid, bank, trade_log, skill bank
    */
    try{
    // let user = await USERS.findOne({uuid: req.body.uuid});

    // let updated = Object.assign(user, req.body);
    console.log(req.body)
    USERS.updateOne({uuid: req.body.uuid}, {$set: req.body}, { upsert: true })
    res.send("updated")
    }catch(e){
        console.log(e)
    }
}
exports.kill = async (req, res) => {
    
    try{
        //remove inventory contents, teleport player to spawn, rez a package in world at death location (after player has been moved), reset ecto/pk, update death/kill statistics
    }catch(e){
        console.log(e)
    }
}
exports.newspaper = async (req, res) => {
    const data = (await sheets.readSheet(`Newspaper!A:D`, '1K1Eg2MIBx3_FHPhzHM_SoU8PgVIoEhyqAgYgh7bfmlo')).data.values.slice(1)
    
    res.render('newspaper', {data: data})
    // res.send(data)
}   

exports.profile = async (req, res) => {
    const user = await USERS.findOne({uuid: req.params.uuid})
    res.render('profile', {user: user})
}