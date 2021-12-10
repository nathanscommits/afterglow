const SPELLS = require("../db").db().collection("SPELLS");
const USERS = require("../db").db().collection("USERS");
const postController = require("./post_controller");


let update = async (req, user) => {
    // const user = await USERS.findOne({slname: 'Sharky Piggins'})

    var io = req.app.get('socketio');
      io.emit(user.uuid, user);
    //   res.send('sent')
}


// Qualities of a spell
    // AOE/single target
    // stationary/moving
    // target, power, crit, range, duration, cost, cooldown, effect


exports.apUpdate = async (req, res) => {
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {ap: parseInt(req.body.ap)}}, {upsert: true})
    let caster = await USERS.findOne({uuid: req.body.uuid})
    update(req, caster)
    console.log(req.body)
    // res.send({display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone]});
    res.status(200).send('updated');
}
exports.targetUpdate = async (req, res) => {
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {target: req.body.target_name}}, {upsert: true})
    let caster = await USERS.findOne({uuid: req.body.uuid})
    update(req, caster)
    console.log(req.body)
    res.status(200).send('updated');
}
let cooldown = async (req, person, cooldown_time) => {
    //run a timeout function ever 1 second and check if cooldown has ended
    let cooling = async () => {
        let user = await USERS.findOne({uuid: person})
        if(user.cooldown > 0) {
            user.cooldown -= 1;
            update(req, user)
            await USERS.updateOne({uuid: person}, {$set: {cooldown: user.cooldown}})
            setTimeout(cooling, 1000);
        } else {
            await USERS.updateOne({uuid: person}, {$set: {cooldown: 0, silenced: false}})
            update(req, user) //might not need this here
        }
    }
    // let user = await USERS.findOne({uuid: person})
    // user.cooldown += cooldown_time;
    await USERS.updateOne({uuid: person}, {$set: {cooldown: cooldown_time, silenced: true}})
    setTimeout(cooling, 1000);
}

exports.spellBar = async (req, res) => {
    const user = await USERS.findOne({slname: 'Sharky Piggins'})
    res.render('spell-bar', {user: user})
}
  
exports.castSpell = async (req, res) => {
try{
    console.log(req.body)
    let caster = await USERS.findOne({uuid: req.body.uuid});
    if (caster.silenced || caster.cooldown > 0) res.send("You can't cast that yet")
    let target;
    if(req.body.uuid != req.body.target || req.body.target != "") {
        target = await USERS.findOne({uuid: req.body.target});
    } else {
        target = caster;
        target.ap = req.body.ap;
    }

    let spell_info
    for(const key in caster.skills) {
        const assigned = caster.skills[key]['assigned'];
        if(assigned == req.body.spell) spell_info = caster.skills[key];
    }
    if(spell_info){
    console.log(spell_info);
    const spell_data = await SPELLS.findOne({name: spell_info.name}); //damage, crit, range, duration, cost, cooldown, effects, name
    
    caster.ap = req.body.ap;
    
    if(caster.ap > caster.ap_max) caster.ap = cast.ap_max;
    else if(caster.ap < 0) caster.ap = 0;
    //check range is within range
    if(req.body.target_distance > spell_data.range) {
        //out of range
        res.send("Target out of range.")
    } else {
        //check AP cost
        spell_data.cost *= caster.stat_buffs.cost;
        if(caster.ap < spell_data.cost) {
            //dont cast spell
            res.send("Not enough resource for that.")
        } else {
            if(!caster.effects.includes('silence')) {
                if(caster.effects.includes('taunt') && target.uuid != caster.taunt_target) {
                    //cant target non taunt target while taunted!
                    res.send("You are being taunted, you can only cast spells at your taunter.")
                } else {
                    // WE GOOD! CAST THE SPELL!
                   
                   preSpell(caster, target, spell_data);
                   SpellEffects(caster, target, spell_data);
                   postSpell(req, caster, target, spell_data);
                   res.send("Cast complete")
                }
            } else {
                res.send("You are silenced and cannot cast spells.")
            }
        }
    }
}else {
    res.send("No spell found")
    console.log("No spell found")
}


}catch(err) {
    console.log(err)
}
}

let SpellEffects = async (caster, target, spell_data) =>{
    if(spell_data.effects.includes("dispell")){
        target.effects = []; // remove effects from target (but how do we stop timed effects? maybe this already stops them besides stat changes)
    } 
}

let preSpell = async (caster, target, spell_data) =>{

    if(caster.uuid == target.uuid) {
        target.ap -= spell_data.cost;
    }
    caster.ap -= spell_data.cost;
    //update casters AP ammount (this happens in postSpell now)
    // await USERS.updateOne({uuid: caster.uuid}, {$set: {ap: caster.ap}}, { upsert: true })
    // postController.post(caster.url, {
    //     display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone]
    // });


    //add caster buffed stats and crit modifiers/////////////////////////////
    const chance = 1 + Math.floor(Math.random() * 100);
    spell_data.crit *= caster.stat_buffs.crit;
    spell_data.damage *= caster.stat_buffs.power;
    spell_data.range *= caster.stat_buffs.range;
    spell_data.duration *= caster.stat_buffs.duration;
    spell_data.cost *= caster.stat_buffs.cost;
    spell_data.cooldown *= parseFloat(caster.stat_buffs.cooldown);
    if(spell_data.effects.includes('first_blood') && target.ecto == target.ecto_max ) spell_data.damage *= 2;
    if(chance <= spell_data.crit) {
        //critical! double power
        spell_data.damage *= 2;
    }
    if(spell_data.effects.includes('execute') && target.ecto <= (target.ecto_max *= 0.2) && spell_data.damage > 0) spell_data.damage = 9999;
    ///////////////////////////////////////////////////////////////////

    // add any buff effects/////////////////////////////////////////////
    target.effects = [...target.effects, ...spell_data.effects]
    target.stat_buffs.power += spell_data.stat_buffs.power
    target.stat_buffs.crit += spell_data.stat_buffs.crit
    target.stat_buffs.range += spell_data.stat_buffs.range
    target.stat_buffs.duration += spell_data.stat_buffs.duration
    target.stat_buffs.cost += spell_data.stat_buffs.cost
   
    target.stat_buffs.cooldown += parseFloat(spell_data.stat_buffs.cooldown)
    target.stat_buffs.ecto_max += spell_data.stat_buffs.ecto_max
    target.stat_buffs.ap_max += spell_data.stat_buffs.ap_max
    target.stat_buffs.impulse += spell_data.stat_buffs.impulse
    target.stat_buffs.resistance += spell_data.stat_buffs.resistance
    target.stat_buffs.reflected += spell_data.stat_buffs.reflected
    ///////////////////////////////////////////////////////////////////
    
    //add target buffed stats////////////////////////////////////////
    spell_data.damage *= target.stat_buffs.resistance;
    //damage caster = reflected-damage
    let reflected_damage = (spell_data.damage *= target.stat_buffs.reflected);
    if(reflected_damage != NaN) caster.ecto -= reflected_damage;
    if(caster.ecto < 0) caster.ecto = 0;
    else if(caster.ecto > caster.ecto_max) caster.ecto = caster.ecto_max
    //check for split damage partner here somewhere!?
    ///////////////////////////////////////////////////////////////
    
}

let postSpell = async (req, caster, target, spell_data) => {
    
    
    
    if(spell_data.damage != NaN) target.ecto -= spell_data.damage;
    if(target.ecto < 0) target.ecto = 0;
    else if(target.ecto > target.ecto_max) target.ecto = target.ecto_max
    caster.ap -= spell_data.cost;
    
    await USERS.updateOne({uuid: caster.uuid}, {$set: {ap: caster.ap, ecto: caster.ecto, target: req.body.target_name}}, { upsert: true })
    update(req, caster)
    caster.stat_buffs.cooldown *= parseFloat(spell_data.cooldown);
    caster.ecto_max *= caster.stat_buffs.ecto_max
    caster.ap_max *= caster.stat_buffs.ap_max
    console.log(`caster cooldown: ${caster.stat_buffs.cooldown}`)
    cooldown(req, caster.uuid, parseFloat(caster.stat_buffs.cooldown))
    let spell_props = {};
        if(spell_data.cast_sound != undefined) spell_props.sound = spell_data.cast_sound
        if(spell_data.cast_animation != undefined) spell_props.animate = spell_data.cast_animation
        if(spell_data.cast_particle != undefined) spell_props.particle = spell_data.cast_particle
    postController.post(caster.url, {
        cooldown: parseFloat(caster.stat_buffs.cooldown),
        display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone],
        ...spell_props
    });

    
    await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
    update(req, target)
    target.ecto_max *= target.stat_buffs.ecto_max
    target.ap_max *= target.stat_buffs.ap_max
    spell_props = {};
    if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
    if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
    if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
    // console.log(`target cooldown: ${caster.stat_buffs.cooldown}`)
    // cooldown(req, target.uuid, parseFloat(target.stat_buffs.cooldown))
    postController.post(target.url, {
        display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone],
        impulse: target.stat_buffs.impulse,
        //cooldown: parseFloat(target.stat_buffs.cooldown),
        owner_say: spell_data.name + " has been cast on you. " + spell_data.desc,
        ...spell_props
    });

    let endBuff = async () => {
        target = await USERS.findOne({uuid: target.uuid});
        //remove buff effects

        if(spell_data.damage != NaN) target.ecto -= spell_data.damage;
        if(target.ecto < 0) target.ecto = 0;
        else if(target.ecto > target.ecto_max) target.ecto = target.ecto_max
        
        
        await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
        update(req, target)
        target.ecto_max *= target.stat_buffs.ecto_max
        target.ap_max *= target.stat_buffs.ap_max
        spell_props = {};
        if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
        if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
        if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
        postController.post(target.url, {
            display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone],
            impulse: target.stat_buffs.impulse,
            //cooldown: parseFloat(target.stat_buffs.cooldown),
            ...spell_props
        });

        spell_data.ticks -= 1;
        if(parseFloat(spell_data.ticks) > 0) {
            if(parseFloat(spell_data.duration) > 0)setTimeout(endBuff, parseFloat(spell_data.duration) * 1000);
        } else {
            //remove buff effects after buff ticks have run out
            target.effects = target.effects.filter(item => !spell_data.effects.includes(item))
            if(spell_data.stat_buffs.power != NaN) target.stat_buffs.power -= spell_data.stat_buffs.power
            if(spell_data.stat_buffs.crit != NaN) target.stat_buffs.crit -= spell_data.stat_buffs.crit
            if(spell_data.stat_buffs.range != NaN) target.stat_buffs.range -= spell_data.stat_buffs.range
            if(spell_data.stat_buffs.duration != NaN) target.stat_buffs.duration -= spell_data.stat_buffs.duration
            if(spell_data.stat_buffs.cost != NaN) target.stat_buffs.cost -= spell_data.stat_buffs.cost
            if(spell_data.stat_buffs.cooldown != NaN) target.stat_buffs.cooldown -= parseFloat(spell_data.stat_buffs.cooldown)
            if(spell_data.stat_buffs.ecto_max != NaN) target.stat_buffs.ecto_max -= spell_data.stat_buffs.ecto_max
            if(spell_data.stat_buffs.ap_max != NaN) target.stat_buffs.ap_max -= spell_data.stat_buffs.ap_max
            if(spell_data.stat_buffs.impulse != NaN) target.stat_buffs.impulse -= spell_data.stat_buffs.impulse
            if(spell_data.stat_buffs.resistance != NaN) target.stat_buffs.resistance -= spell_data.stat_buffs.resistance
            if(spell_data.stat_buffs.reflected != NaN) target.stat_buffs.reflected -= spell_data.stat_buffs.reflected
            target.ecto_max *= target.stat_buffs.ecto_max
            target.ap_max *= target.stat_buffs.ap_max

            await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
            update(req, target)
            postController.post(target.url, {
                display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone],
                impulse: target.stat_buffs.impulse,
                //cooldown: parseFloat(target.stat_buffs.cooldown)
            });
        }
    }
    if(parseFloat(spell_data.ticks) > 0 && parseFloat(spell_data.duration) > 0) {
       setTimeout(endBuff, parseFloat(spell_data.duration) * 1000);
    } 
    
}
exports.createSpell = async (req, res) => {
try{
    let spell_object = {
        name: req.body.name,
        desc: req.body.desc,
        image: req.body.image,
        type: req.body.type,
        scope: req.body.scope,
        duration: parseFloat(req.body.duration),
        ticks: parseFloat(req.body.ticks),
        range: parseFloat(req.body.range),
        damage: parseFloat(req.body.damage),
        crit: parseFloat(req.body.crit),
        cost: parseFloat(req.body.cost),
        cooldown: parseFloat(req.body.cooldown),
        stat_buffs: {
            power: parseFloat(req.body.buff_power),
            crit: parseFloat(req.body.buff_crit),
            range: parseFloat(req.body.buff_range),
            duration: parseFloat(req.body.buff_duration),
            cost: parseFloat(req.body.buff_cost),
            cooldown: parseFloat(req.body.buff_cooldown),
            ecto_max: parseFloat(req.body.buff_ecto_max),
            ap_max: parseFloat(req.body.buff_ap_max),
            impulse: parseFloat(req.body.buff_impulse),
            resistance: parseFloat(req.body.buff_resistance),
            reflected: parseFloat(req.body.buff_reflected)
        },
        effects: [req.body.effect],
        cast_animation: req.body.cast_animation,
        hit_animation: req.body.hit_animation,
        cast_sound: req.body.cast_sound,
        hit_sound: req.body.hit_sound,
    }
    await SPELLS.insertOne(spell_object);
    res.redirect("/create_spell");
} catch(e) {
    console.log(e)
}
}
exports.assignSpell = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    let duplicate_checker = false;
    for(var key in user.skills){
        if(user.skills[key].assigned == req.body.assigned) {
            user.skills[key].assigned = 0;
        }
        if(user.skills[key].name == req.body.name) {
            user.skills[key].assigned = req.body.assigned
            duplicate_checker = true;
        }
    }
    if(!duplicate_checker) {
        const spell_image = await SPELLS.findOne({name: req.body.name})
        user.skills[req.body.name] = {
            name: req.body.name,
            assigned: req.body.assigned,
            image: spell_image.image
        }
    }

    await USERS.updateOne({uuid: req.body.uuid}, {$set: {skills: user.skills}})
    res.send('updated spells')
}
exports.assignSpellForm = async (req, res) => {
    const user = await USERS.findOne({uuid: req.params.uuid})
    res.render('assign-spells', {user: user})
}
// let spell_object = {
//     name: "example",
//     desc: "a spell for testing code",
//     type: "buff",
//     scope: "single",
//     duration: 10,
//     range: 20,
//     damage: 0,
//     crit: 0,
//     cost: 20,
//     cooldown: 2,
//     stat_buffs: {
//         damage: 0,
//         crit: 0,
//         range: 0,
//         duration: 0,
//         cost: 0,
//         cooldowm: 0,
//     },
//     effects: []
// }

//lose 1 ecto every 40 mins for every player in the db!