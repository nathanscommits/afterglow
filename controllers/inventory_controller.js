
const USERS = require("../db").db().collection("USERS");
const NPC = require("../db").db().collection("NPC");
const ITEMS = require("../db").db().collection("ITEMS");
const postController = require("./post_controller");


//hold, vend, buy, sell, trade, bank
let addInventory = async (req, res, next) => {
    try{
        const user = await USERS.findOne({uuid: req.body.uuid})
        let inventory = user.inventory;
        let found = false;
        console.log(req.body)
        inventory.forEach( (e, i) => {
            console.log(e + " " + i)
            if(e.name !== undefined && e.name == req.body.name) {
                found = true;
                inventory[i]['quantity'] +=  req.body.quantity;
            }
        })
        if(!found) {
            if(inventory.length < user.inventory_size) {
                inventory.push({
                    ...req.body
                });
            } else {
                res.send("Inventory full");
                return;
            }
            
        }
        await USERS.updateOne({uuid: req.body.uuid}, {$set: {inventory: inventory}}, {upsert: true});
        // res.send("Item added");
        next();
    } catch(e) {
        console.log(e)
    }
}
exports.addInventory = (req, res, next) => addInventory(req, res, next);
exports.getInventory = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    res.send(user.inventory);
}
let removeInventory = async (req, res, next) => {
  try{
    const user = await USERS.findOne({uuid: req.body.uuid})
    let inventory = user.inventory;

    inventory.forEach( (e, i) => {
        if(e.name !== undefined && e.name == req.body.name) {
            inventory[i]['quantity'] -=  req.body.quantity
            if(inventory[i]['quantity'] < 1 ) {
                inventory.splice(i, 1);
            }
        }
    })
    
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {inventory: inventory}}, {upsert: true});
    // res.send("Item removed");
    next();
  } catch(e) {
      console.log(e)
  }
}
exports.removeInventory = (req, res, next) => removeInventory(req, res, next);


exports.depositBank = async (req, res, next) => {
    try{
        await removeInventory(req, res, next);
        const user = await USERS.findOne({uuid: req.body.uuid})
        let bank = user.bank;
        let found = false;
        console.log(req.body)
        bank.forEach( (e, i) => {
            console.log(e + " " + i)
            if(e.name !== undefined && e.name == req.body.name) {
                found = true;
                bank[i]['quantity'] +=  req.body.quantity;
            }
        })
        if(!found) {
            if(bank.length < user.bank_size) {
                bank.push({
                    ...req.body
                });
            } else {
                res.send("Inventory full");
                return;
            }
            
        }
        await USERS.updateOne({uuid: req.body.uuid}, {$set: {bank: bank}}, {upsert: true});
        // res.send("Item added");
        next();
    } catch(e) {
        console.log(e)
    }
}
exports.withdrawBank = async (req, res) => {
try{
    const user = await USERS.findOne({uuid: req.body.uuid})
    let bank = user.bank;
    
    bank.forEach( (e, i) => {
        if(e.name !== undefined && e.name == req.body.name) {
            if(bank[i]['quantity'] < req.body.quantity) {
                res.send("You don't have that many of that item.")
                return;
            }
            bank[i]['quantity'] -=  req.body.quantity
            if(bank[i]['quantity'] < 1 ) {
                bank.splice(i, 1);
            }
        }
    })
    
    await USERS.updateOne({uuid: req.body.uuid}, {$set: {bank: bank}}, {upsert: true});
    // res.send("Item removed");
    await addInventory(req, res, next);
    next();
    } catch(e) {
        console.log(e)
    }
}
exports.depositBones = async (req, res) => {
    try{
        await removeInventory(req, res, next);
        const user = await USERS.findOne({uuid: req.body.uuid})
        let bone_bank = user.bone_bank;
        let bone = user.bone;
        bone -= req.body.ammount
        bone_bank += req.body.ammount
        await USERS.updateOne({uuid: req.body.uuid}, {$set: {bank: bank}}, {upsert: true});
        // res.send("Item added");
        next();
    } catch(e) {
        console.log(e)
    }
}
exports.withdrawBones = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    res.send(user.inventory);
}
exports.tradeInventory = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    res.send(user.inventory);
}
exports.addBones = async (req, res) => {
    const user = await USERS.findOne({uuid: req.body.uuid})
    res.send(user.inventory);
}

// exports.marketInventory = async (req, res) => {
//     const user = await USERS.findOne({uuid: req.body.uuid})
//     res.send(user.inventory);
// }

exports.addItem = (req, res) => {
}

exports.displayInventory = async (req, res) => {
    req.body.uuid = "3ffd8a53-ff55-4632-8ebe-54b73b07e1a1"
    const user = await USERS.findOne({uuid: req.body.uuid})
    // res.send(user)
    res.render('inventory', {user: user})
}
// module.exports = {addInventory, removeInventory}

