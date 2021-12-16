const SPELLS = require("../db").db().collection("SPELLS");
const USERS = require("../db").db().collection("USERS");
const postController = require("./post_controller");


let update = async (req, user) => {
    // const user = await USERS.findOne({slname: 'Sharky Piggins'})

    var io = req.app.get('socketio');
      io.emit(user.uuid, user);
    //   res.send('sent')
}

let death = async (user, req) => {
    if(user.race == "phantom" && user.combat.cheat_death_time < new Date()){ // SUBTRACT THE HOURS OFF OF THIS!!
        cheat_death_time = new Date();
        user.ecto = user.ecto_max * 0.5; // 50% of max ecto
        return;
    } else {
        //drop loot
        //teleport user to kharons office
        // have kharon say something about your death
        //rez dead body object
        //reset stats

    }
}
exports.aoeSpell = async (req, res)=> {
    //calculate spell effects scaling
    let damage;
    //loop through every avatar, adding the spell effects
    let avatars = req.body.avatars
    let data = await USERS.find({}).toArray()
    avatars.forEach(av => {
        if(av == req.body.uuid) return;
        let i = data.indexOf({uuid: av})
        let ecto = data[i].ecto - damage
        USERS.updateOne({uuid: av}, {$set: {ecto: ecto}})
    });
    res.send("AOE cast complete")
}
exports.summonSpell = async (req, res)=> {
    //calculate spell effects scaling
    
    //loop through every avatar, adding the spell effects
}
exports.apUpdate = async (req, res) => {
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {ap: parseInt(req.body.ap)}}, {upsert: true})
    let caster = await USERS.findOne({uuid: req.body.uuid})
    update(req, caster)
    console.log(req.body)
    // res.send({display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone]});
    res.status(200).send('updated');
}
exports.targetUpdate = async (req, res) => {
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {"combat.target": req.body.target_name}}, {upsert: true})
    let caster = await USERS.findOne({uuid: req.body.uuid})
    update(req, caster)
    console.log(req.body)
    res.status(200).send('updated');
}
let cooldown = async (req, person, cooldown_time, spell_num) => {
    //run a timeout function ever 1 second and check if cooldown has ended
    let user = await USERS.findOne({uuid: person.uuid})
    user.combat.cooldown[spell_num] = cooldown_time
    let cooling = async () => {
        user = await USERS.findOne({uuid: person.uuid})
        if(user.combat.cooldown[spell_num] > 0) {
            // user.combat.cooldown[spell_num] -= 1;
            user.combat.cooldown[spell_num] -= 1;
            await USERS.updateOne({uuid: user.uuid}, {$set: {combat: user.combat}})
            setTimeout(cooling, 1000);
        } else {
            user.combat.cooldown[spell_num] = 0;
            await USERS.updateOne({uuid: user.uuid}, {$set: {combat: user.combat}})
            //update(req, user) //might not need this here
        }
        update(req, user)
    }
    // let user = await USERS.findOne({uuid: person})
    // user.combat.cooldown += cooldown_time;
    await USERS.updateOne({uuid: person.uuid}, {$set: {combat: user.combat}})
    update(req, person)
    setTimeout(cooling, 1000);
}
exports.spellBar = async (req, res) => {
    var query = require('url').parse(req.url,true).query;
    const user = await USERS.findOne({uuid: query.uuid})
    if(user)res.render('spell-bar', {user: user})
    else res.send("no user")
}
  
exports.castSpell = async (req, res) => {
try{
    console.log(req.body)
    processSpell(req, res)
    // let caster = await USERS.findOne({uuid: req.body.uuid});
    // if (caster.combat.silenced || caster.combat.cooldown > 0) res.send("You can't cast that yet")
    // let target;
    // if(req.body.uuid != req.body.target || req.body.target != "") {
    //     target = await USERS.findOne({uuid: req.body.target});
    // } else {
    //     target = caster;
    //     target.ap = req.body.ap;
    // }

    // let spell_info
    // for(const key in caster.skills) {
    //     const assigned = caster.skills[key]['assigned'];
    //     if(assigned == req.body.spell) spell_info = caster.skills[key];
    // }
    // if(!spell_info){
    //     res.send("No spell found")
    //     console.log("No spell found")
    // }
    // console.log(spell_info);
    // const spell_data = await SPELLS.findOne({name: spell_info.name}); //damage, crit, range, duration, cost, cooldown, effects, name
    
    // caster.ap = req.body.ap;
    
    // if(caster.ap > caster.ap_max) caster.ap = cast.ap_max;
    // else if(caster.ap < 0) caster.ap = 0;
   
    // //check AP cos
    // spell_data.cost *= caster.stat_buffs.cost;
    // if(caster.ap < spell_data.cost) {
    //     //not enough PK
    //     res.send("Not enough resource for that.")
    // } else if(req.body.target_distance > spell_data.range) {
    //     //out of range
    //     res.send("Target out of range.")
    // } else if(caster.effects.includes('silence')) {
    //     res.send("You are silenced and cannot cast spells.")
    // }else if(target.effects.includes('invisible')) {
    //     res.send("Your target is invisible.")
    // }else if(caster.effects.includes('dodge')) {
    //     //roll a chance to miss
    // }else if(spell_data.effects.includes("rabid") && spell_data.damage <= 0) {
    //     res.send('You can only cast damage spells while you are rabid!')
    // }else if(caster.effects.includes('taunt') && target.uuid != caster.combat.taunt_target) {
    //     //cant target non taunt target while taunted!
    //     res.send("You are being taunted, you can only cast spells at your taunter.")
    // } else if(spell_data.scope == "summon") {
    //     let spell_props = {};
    //     if(spell_data.summon_item != undefined) spell_props.summon_item = spell_data.summon_item
    //     if(spell_data.summon_time != undefined) spell_props.summon_time = spell_data.summon_time
    //     if(spell_data.summon_range != undefined) spell_props.summon_range = spell_data.summon_range
    //     if(spell_data.summon_dot != undefined) spell_props.summon_dot = spell_data.summon_dot
    //     res.send(spell_props)
    // } else if(spell_data.scope == "aoe") {
    //     res.send({
    //         aoe_attack: {
    //             damage: spell_data.damage,
    //             duration: spell_data.duration,
    //             freq: spell_data.ticks,
    //             range: spell_data.range
    //         }
    //     })
    // } else {
    //     // WE GOOD! CAST THE SPELL!
        
    //     preSpell(caster, target, spell_data);
    //     SpellEffects(caster, target, spell_data);
    //     postSpell(req, caster, target, spell_data);
    //     res.send("Cast complete")
    // }



}catch(err) {
    console.log(err)
}
}

let split_damage = async (caster, target, damage) => {
    var split_target
    if(target.combat.damage_split_target != caster.uuid) split_target = await USERS.findOne({uuid: target.combat.damage_split_target})
    else split_target = caster
    var new_ecto = split_target.ecto - (damage/2)
    if(new_ecto <= 0) {
        // DEATH?
        new_ecto = 1;
    }else if(new_ecto > split_target.ecto_max) new_ecto = split_target.ecto_max
    target.ecto += (damage/2)
    await USERS.updateOne({uuid: split_target.uuid}, {$set: {ecto: new_ecto}})
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
        cdamage: parseFloat(req.body.cdamage),
        crit: parseFloat(req.body.crit),
        cost: parseFloat(req.body.cost),
        tcost: parseFloat(req.body.tcost),
        freq: parseFloat(req.body.freq),
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
            reflected: parseFloat(req.body.buff_reflected),
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
    update(req, user)
    res.send('updated spells')
}
exports.assignSpellForm = async (req, res) => {
    const user = await USERS.findOne({uuid: req.params.uuid})
    res.render('assign-spells', {user: user})
}
var check_requirements = (req, res, spell_data, caster, target) => {
    //check AP cost
    if(caster.ap < (spell_data.cost *= caster.stat_buffs.cost)) {
        //not enough PK
        res.send("Not enough PK for that spell.")
        return;
    } else if (caster.combat.silenced || caster.combat.cooldown[req.body.spell] > 0){
         res.send("You can't cast that yet")
         return;
    } else if(req.body.target_distance > spell_data.range) {
        //out of range
        res.send("Target out of range.")
        return;
    } else if(caster.effects.includes('silence')) {
        res.send("You are silenced and cannot cast spells.")
        return;
    }else if(target.effects.includes('invisible')) {
        res.send("Your target is invisible.")
        return;
    }else if(caster.effects.includes('dodge')) {
        //roll a chance to miss
    }else if(spell_data.effects.includes("rabid") && spell_data.damage <= 0) {
        res.send('You can only cast damage spells while you are rabid!')
        return;
    }else if(caster.effects.includes('taunt') && target.uuid != caster.combat.taunt_target) {
        //cant target non taunt target while taunted!
        res.send("You are being taunted, you can only cast spells at your taunter.")
        return;
    } else if(spell_data.scope == "summon") {
        res.send({
            summon: {
                summon_item: spell_data.summon_item,
                summon_time: spell_data.summon_time,
                summon_range: spell_data.summon_range,
                summon_dot: spell_data.summon_dot
            }
        })
        return;
    } else if(spell_data.scope == "aoe") {
        res.send({
            aoe_attack: {
                damage: spell_data.damage,
                duration: spell_data.duration,
                freq: spell_data.ticks,
                range: spell_data.range
            }
        })
        return;
    } 
}
let SpellEffects = (caster, target, spell_data) =>{
    if(spell_data.effects.includes("dispell")){
        target.effects = []; // remove effects from target (but how do we stop timed effects? maybe this already stops them besides stat changes)
    } if(spell_data.effects.includes("death_wish")) {
        var health_per = caster.ecto/caster.ecto_max * 100
        spell_data.stat_buffs.power = 100 - health_per
        //start a timer for this effect
    } if(spell_data.effects.includes("taunt")) {
        target.combat.taunt_target = caster.uuid //need to turn this off again somehow
        //start a timer for this effect
    } if(spell_data.effects.includes("bone_shield")) {
        //start a timer for this effect
        caster.bone -= 1;
    } if(spell_data.effects.includes("sticky_fingers")) {
        //roll a dice for success
        const chance = 1 + Math.floor(Math.random() * 100);
        if(chance <= 30) {
            //success awards bones from target to caster

        } else {
            //failure debuffs caster

        }
    } if(spell_data.effects.includes("hysteria")) {
        spell_data.tcost = target_distance / spell_data.tcost
    } if(target.effects.includes("serenity")) {
        spell_data.damage = 0;
    } if(spell_data.effects.includes("shared_suffering")) {
        //start a timer for this effect
        //caster.combat.damage_split_target = target.uuid
        target.combat.damage_split_target = caster.uuid
    }
}
var casters_buffs = (req, res, spell_data, caster) =>{
    //add caster buffed stats and crit modifiers/////////////////////////////
    const chance = 1 + Math.floor(Math.random() * 100);
    spell_data.crit *= caster.stat_buffs.crit;
    spell_data.impulse *= caster.stat_buffs.impulse;
    spell_data.ap_max *= caster.stat_buffs.ap_max;
    spell_data.ecto_max *= caster.stat_buffs.ecto_max;
    spell_data.damage *= caster.stat_buffs.power;
    spell_data.range *= caster.stat_buffs.range;
    spell_data.duration *= caster.stat_buffs.duration;
    spell_data.resistance *= caster.stat_buffs.resistance;
    spell_data.reflected *= caster.stat_buffs.reflected;
    spell_data.cost *= caster.stat_buffs.cost;
    spell_data.cooldown *= parseFloat(caster.stat_buffs.cooldown);
    if(spell_data.effects.includes('first_blood') && target.ecto == target.ecto_max ) spell_data.damage *= 2;
    if(chance <= spell_data.crit) {
        //critical! double power
        spell_data.damage *= 2;
    }
    if(spell_data.effects.includes('execute') && target.ecto <= (target.ecto_max *= 0.2) && spell_data.damage > 0) spell_data.damage = 9999;
    ///////////////////////////////////////////////////////////////////
}
var targets_buffs = (req, res, spell_data, caster, target) => {
    // add any buff effects/////////////////////////////////////////////
    target.effects = [...target.effects, ...spell_data.effects]
    target.stat_buffs.power *= spell_data.stat_buffs.power
    target.stat_buffs.crit *= spell_data.stat_buffs.crit
    target.stat_buffs.range *= spell_data.stat_buffs.range
    target.stat_buffs.duration *= spell_data.stat_buffs.duration
    target.stat_buffs.cost *= spell_data.stat_buffs.cost
    target.stat_buffs.cooldown *= parseFloat(spell_data.stat_buffs.cooldown)
    target.stat_buffs.ecto_max *= spell_data.stat_buffs.ecto_max
    target.stat_buffs.ap_max *= spell_data.stat_buffs.ap_max
    target.stat_buffs.impulse *= spell_data.stat_buffs.impulse
    target.stat_buffs.resistance *= spell_data.stat_buffs.resistance
    target.stat_buffs.reflected *= spell_data.stat_buffs.reflected
    ///////////////////////////////////////////////////////////////////
    
    //add target buffed stats////////////////////////////////////////
    spell_data.damage *= target.stat_buffs.resistance; //convert to %/100%?
    //damage caster = reflected-damage
    let reflected_damage = (spell_data.damage *= target.stat_buffs.reflected);
    if(reflected_damage != NaN) caster.ecto -= reflected_damage;
    //check for split damage partner here somewhere!?
    ///////////////////////////////////////////////////////////////
}
var execute_spell = (req, res, spell_data, caster, target) => {
    //deduct PK
    caster.ap -= spell_data.cost; //do we want to deduct it once per spell or once per tick?
    if(caster.uuid == target.uuid) target.ap = caster.ap;
    target.ap -= spell_data.tcost;
    if(caster.uuid == target.uuid) caster.ap = target.ap;

    //deduct ecto
    console.log(`right before ecto deduction = ${target.ecto}
    spell damage: ${spell_data.damage}
    spell cdamage: ${spell_data.cdamage}
    `)
    target.ecto -= spell_data.damage
    console.log(`right after ecto deduction = ${target.ecto}`)
    if(caster.uuid == target.uuid) caster.ecto = target.ecto;
    caster.ecto -= spell_data.cdamage
    if(caster.uuid == target.uuid) target.ecto = caster.ecto;

    // if(target.combat.damage_split_target != '' && target.uuid != caster.uuid) {
    //     if(spell_data.damage)split_damage(caster, target, spell_data.damage)
    //     if(spell_data.cdamage) split_damage(target, caster, spell_data.cdamage)
    // }

    // if(caster.effects.includes("serenity")) {
    //     caster.effects = caster.effects.filter(item => {
    //         return item !== "serenity"
    //     })
    //     caster.assault_time = new Date(); //should this be outside of this effects scope?
    // }

    // check min max's on ecto and pk
    let caster_max_ecto = caster.ecto_max * spell_data.ecto_max;
    let target_max_ecto = target.ecto_max * spell_data.ecto_max;
    if(caster.ap < 0) caster.ap = 0;
    else if(caster.ap > caster.ap_max) caster.ap = caster.ap_max
    if(caster.ecto < 0) caster.ecto = 0;
    else if(caster.ecto > caster_max_ecto) caster.ecto = caster_max_ecto
    if(target.ap < 0) target.ap = 0;
    else if(target.ap > target.ap_max) target.ap = target.ap_max
    if(target.ecto < 0) target.ecto = 0;
    else if(target.ecto > target_max_ecto) target.ecto = target_max_ecto
    console.log(`right after max ecto calc = ${target.ecto} max ecto = ${target_max_ecto}`)
    //update hud sockets
    update(req, target)
    update(req, caster)
    //save changes
    USERS.updateOne({uuid: caster.uuid}, {$set: {ecto: caster.ecto, ap: caster.ap, effects: caster.effects, stat_buffs: caster.stat_buffs, ecto_max: caster.ecto_max, ap_max: caster.ap_max}}, { upsert: true }) //dont think these need to be async
    USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true }) //dont think these need to be async
    //post updates to SL
    let spell_props = {};
        if(spell_data.cast_sound != undefined) spell_props.sound = spell_data.cast_sound
        if(spell_data.cast_animation != undefined) spell_props.animate = spell_data.cast_animation
        if(spell_data.cast_particle != undefined) spell_props.particle = spell_data.cast_particle
    postController.post(caster.url, {
        // cooldown: parseFloat(caster.stat_buffs.cooldown),
        display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone, caster.race],
        ...spell_props
    });

    spell_props = {};
    if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
    if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
    if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
    postController.post(target.url, {
        display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
        impulse: target.stat_buffs.impulse,
        owner_say: spell_data.name + " has been cast on you. " + spell_data.desc,
        ...spell_props
    });


    spell_data.ticks -= 1;
    if(parseFloat(spell_data.ticks) > 0) {
        spell_props = {};
        if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
        if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
        if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
        postController.post(target.url, {
            display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
            impulse: target.stat_buffs.impulse,
            ...spell_props
        });
        if(parseFloat(spell_data.duration) > 0)setTimeout(execute_spell(req, res, spell_data, caster, target), parseFloat(spell_data.duration) * 1000);
    } else {
        // if(target.effects.includes("shared_suffering")) {
        //     target.combat.damage_split_target = ''
        //     //will this work?
        // }
        target.effects = target.effects.filter(item => !spell_data.effects.includes(item))
        if(spell_data.stat_buffs.power != NaN) target.stat_buffs.power /= spell_data.stat_buffs.power
        if(spell_data.stat_buffs.crit != NaN) target.stat_buffs.crit /= spell_data.stat_buffs.crit
        if(spell_data.stat_buffs.range != NaN) target.stat_buffs.range /= spell_data.stat_buffs.range
        if(spell_data.stat_buffs.duration != NaN) target.stat_buffs.duration /= spell_data.stat_buffs.duration
        if(spell_data.stat_buffs.cost != NaN) target.stat_buffs.cost /= spell_data.stat_buffs.cost
        if(spell_data.stat_buffs.cooldown != NaN) target.stat_buffs.cooldown /= parseFloat(spell_data.stat_buffs.cooldown)
        if(spell_data.stat_buffs.ecto_max != NaN) target.stat_buffs.ecto_max /= spell_data.stat_buffs.ecto_max
        if(spell_data.stat_buffs.ap_max != NaN) target.stat_buffs.ap_max /= spell_data.stat_buffs.ap_max
        if(spell_data.stat_buffs.impulse != NaN) target.stat_buffs.impulse /= spell_data.stat_buffs.impulse
        if(spell_data.stat_buffs.resistance != NaN) target.stat_buffs.resistance /= spell_data.stat_buffs.resistance
        if(spell_data.stat_buffs.reflected != NaN) target.stat_buffs.reflected /= spell_data.stat_buffs.reflected
        if(spell_data.stat_buffs.ecto_max != NaN) target.stat_buffs.ecto_max /= spell_data.stat_buffs.ecto_max
        if(spell_data.stat_buffs.ap_max != NaN) target.stat_buffs.ap_max /= spell_data.stat_buffs.ap_max
        // target.ecto_max *= target.stat_buffs.ecto_max
        // target.ap_max *= target.stat_buffs.ap_max

        USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
        update(req, target)
        postController.post(target.url, {
            display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
            impulse: target.stat_buffs.impulse
        });
    }
}
var processSpell = async(req, res) => {
    //grab data
    let caster = await USERS.findOne({uuid: req.body.uuid})
    let spell_info
    for(const key in caster.skills) {
        const assigned = caster.skills[key]['assigned'];
        if(assigned == req.body.spell) spell_info = caster.skills[key];
    }
    let spell_data = await SPELLS.findOne({name: spell_info.name})

    if(caster.combat.cooldown[req.body.spell] > 0) {
        res.send("Skill is on cooldown")
        return;
    }
    
    //if AOE, filter list of avatars in range and loop next steps over each avatar (need custom requirements check)

    let target = await USERS.findOne({uuid: req.body.target})
    //check requirements
    check_requirements(req, res, spell_data, caster, target)
    //add/remove spell effects
    SpellEffects(caster, target, spell_data)
    //pass through casters buffs
    //pass in casters spell level buff
    casters_buffs(req, res, spell_data, caster)
    //add buffs/debuffs to target stats, pass through target resistances
    targets_buffs(req, res, spell_data, caster, target)
    
    //execute, save data
    //start cooldown
    // caster.combat.cooldown[req.body.spell] = spell_data.cooldown;
    cooldown(req, caster, spell_data.cooldown, req.body.spell) 

    //start timers
    if(parseFloat(spell_data.ticks) > 0 && parseFloat(spell_data.duration) > 0) {
        setTimeout(execute_spell(req, res, spell_data, caster, target), parseFloat(spell_data.duration) * 1000);
    } else {
        execute_spell(req, res, spell_data, caster, target)
    }

    res.send("cast complete")
}

// let preSpell = async (caster, target, spell_data) =>{

//     caster.ap -= spell_data.cost;
//     if(caster.uuid == target.uuid) {
//         target.ap = caster.ap;
//     }

//     //add caster buffed stats and crit modifiers/////////////////////////////
//     const chance = 1 + Math.floor(Math.random() * 100);
//     spell_data.crit *= caster.stat_buffs.crit;
//     spell_data.damage *= caster.stat_buffs.power;
//     spell_data.range *= caster.stat_buffs.range;
//     spell_data.duration *= caster.stat_buffs.duration;
//     spell_data.cost *= caster.stat_buffs.cost;
//     spell_data.cooldown *= parseFloat(caster.stat_buffs.cooldown);
//     if(spell_data.effects.includes('first_blood') && target.ecto == target.ecto_max ) spell_data.damage *= 2;
//     if(chance <= spell_data.crit) {
//         //critical! double power
//         spell_data.damage *= 2;
//     }
//     if(spell_data.effects.includes('execute') && target.ecto <= (target.ecto_max *= 0.2) && spell_data.damage > 0) spell_data.damage = 9999;
//     ///////////////////////////////////////////////////////////////////

    
    
// }
// let postSpell = async (req, caster, target, spell_data) => {

//     if(spell_data.damage != NaN) {
//         target.ecto -= spell_data.damage;
//         if(target.ecto < 0) target.ecto = 0;
//         else if(target.ecto > target.ecto_max) target.ecto = target.ecto_max
        
//         if(target.combat.damage_split_target != '') {
//            split_damage(caster, target, spell_data.damage)
//         }
//         if(caster.effects.includes("serenity")) {
//             caster.effects = caster.effects.filter(item => {
//                 return item !== "serenity"
//             })
//         }
//         caster.assault_time = new Date();
//     }

//     if(spell_data.cdamage != NaN) {
//         caster.ecto -= spell_data.cdamage
//         if(caster.ecto < 0) caster.ecto = 0;
//         else if(caster.ecto > caster.ecto_max) caster.ecto = caster.ecto_max
//         if(caster.combat.damage_split_target != '') {
//             var split_target
//             if(caster.combat.damage_split_target != target.uuid) split_target = await USERS.findOne({uuid: target.combat.damage_split_target})
//             else split_target = target
//             var new_ecto = split_target.ecto - (spell_data.cdamage/2)
//             if(new_ecto <= 0) {
//                 // DEATH?
//                 new_ecto = 1;
//             }else if(new_ecto > split_target.ecto_max) new_ecto = split_target.ecto_max
//             caster.ecto += (spell_data.cdamage/2)
//             await USERS.updateOne({uuid: split_target.uuid}, {$set: {ecto: new_ecto}})
//         }
//     }



    
//     caster.ap -= spell_data.cost;
//     if(caster.ap > caster.ap_max) caster.ap = caster.ap_max
//     target.ap -= spell_data.tcost;
//     if(target.ap > target.ap_max) target.ap = target.ap_max
//     else if(target.ap < 0) target.ap = 0;
    
//     await USERS.updateOne({uuid: caster.uuid}, {$set: {ap: caster.ap, ecto: caster.ecto, target: req.body.target_name}}, { upsert: true })
//     update(req, caster)
//     caster.stat_buffs.cooldown *= parseFloat(spell_data.cooldown);
//     caster.ecto_max *= caster.stat_buffs.ecto_max
//     caster.ap_max *= caster.stat_buffs.ap_max
//     console.log(`caster cooldown: ${caster.stat_buffs.cooldown}`)
//     cooldown(req, caster.uuid, parseFloat(caster.stat_buffs.cooldown))
//     let spell_props = {};
//         if(spell_data.cast_sound != undefined) spell_props.sound = spell_data.cast_sound
//         if(spell_data.cast_animation != undefined) spell_props.animate = spell_data.cast_animation
//         if(spell_data.cast_particle != undefined) spell_props.particle = spell_data.cast_particle
//     postController.post(caster.url, {
//         cooldown: parseFloat(caster.stat_buffs.cooldown),
//         display: [caster.ecto, caster.ecto_max, caster.ap, caster.ap_max, caster.bone, caster.race],
//         ...spell_props
//     });

    
//     await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
//     update(req, target)
//     target.ecto_max *= target.stat_buffs.ecto_max
//     target.ap_max *= target.stat_buffs.ap_max
//     spell_props = {};
//     if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
//     if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
//     if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
//     // console.log(`target cooldown: ${caster.stat_buffs.cooldown}`)
//     // cooldown(req, target.uuid, parseFloat(target.stat_buffs.cooldown))
//     postController.post(target.url, {
//         display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
//         impulse: target.stat_buffs.impulse,
//         //cooldown: parseFloat(target.stat_buffs.cooldown),
//         owner_say: spell_data.name + " has been cast on you. " + spell_data.desc,
//         ...spell_props
//     });

//     let endBuff = async () => {
//         target = await USERS.findOne({uuid: target.uuid});
//         //remove buff effects

//         if(spell_data.damage != NaN) target.ecto -= spell_data.damage;
//         if(target.ecto < 0) target.ecto = 0;
//         else if(target.ecto > target.ecto_max) target.ecto = target.ecto_max
//         if(target.combat.damage_split_target != '') {
//             split_damage(caster, target, spell_data.damage)
//         }
        
        
//         await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
//         update(req, target)
//         target.ecto_max *= target.stat_buffs.ecto_max
//         target.ap_max *= target.stat_buffs.ap_max
//         spell_props = {};
//         if(spell_data.hit_sound != undefined) spell_props.sound = spell_data.hit_sound
//         if(spell_data.hit_animation != undefined) spell_props.animate = spell_data.hit_animation
//         if(spell_data.hit_particle != undefined) spell_props.particle = spell_data.hit_particle
//         postController.post(target.url, {
//             display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
//             impulse: target.stat_buffs.impulse,
//             //cooldown: parseFloat(target.stat_buffs.cooldown),
//             ...spell_props
//         });

//         spell_data.ticks -= 1;
//         if(parseFloat(spell_data.ticks) > 0) {
//             if(parseFloat(spell_data.duration) > 0)setTimeout(endBuff, parseFloat(spell_data.duration) * 1000);
//         } else {
//             //remove buff effects after buff ticks have run out
//             if(target.effects.includes("shared_suffering")) {
//                 target.combat.damage_split_target = ''
//                 //will this work?
//             }
//             target.effects = target.effects.filter(item => !spell_data.effects.includes(item))
//             if(spell_data.stat_buffs.power != NaN) target.stat_buffs.power -= spell_data.stat_buffs.power
//             if(spell_data.stat_buffs.crit != NaN) target.stat_buffs.crit -= spell_data.stat_buffs.crit
//             if(spell_data.stat_buffs.range != NaN) target.stat_buffs.range -= spell_data.stat_buffs.range
//             if(spell_data.stat_buffs.duration != NaN) target.stat_buffs.duration -= spell_data.stat_buffs.duration
//             if(spell_data.stat_buffs.cost != NaN) target.stat_buffs.cost -= spell_data.stat_buffs.cost
//             if(spell_data.stat_buffs.cooldown != NaN) target.stat_buffs.cooldown -= parseFloat(spell_data.stat_buffs.cooldown)
//             if(spell_data.stat_buffs.ecto_max != NaN) target.stat_buffs.ecto_max -= spell_data.stat_buffs.ecto_max
//             if(spell_data.stat_buffs.ap_max != NaN) target.stat_buffs.ap_max -= spell_data.stat_buffs.ap_max
//             if(spell_data.stat_buffs.impulse != NaN) target.stat_buffs.impulse -= spell_data.stat_buffs.impulse
//             if(spell_data.stat_buffs.resistance != NaN) target.stat_buffs.resistance -= spell_data.stat_buffs.resistance
//             if(spell_data.stat_buffs.reflected != NaN) target.stat_buffs.reflected -= spell_data.stat_buffs.reflected
//             target.ecto_max *= target.stat_buffs.ecto_max
//             target.ap_max *= target.stat_buffs.ap_max

//             await USERS.updateOne({uuid: target.uuid}, {$set: {ecto: target.ecto, ap: target.ap, effects: target.effects, stat_buffs: target.stat_buffs, ecto_max: target.ecto_max, ap_max: target.ap_max}}, { upsert: true });
//             update(req, target)
//             postController.post(target.url, {
//                 display: [target.ecto, target.ecto_max, target.ap, target.ap_max, target.bone, target.race],
//                 impulse: target.stat_buffs.impulse,
//                 //cooldown: parseFloat(target.stat_buffs.cooldown)
//             });
//         }
//     }
//     if(parseFloat(spell_data.ticks) > 0 && parseFloat(spell_data.duration) > 0) {
//        setTimeout(endBuff, parseFloat(spell_data.duration) * 1000);
//     } 
    
// }