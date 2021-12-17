const phin = require('phin')

exports.post = async (url, data) => {
    try{
        await phin({
            url: url,
            method: 'POST',
            data: data
        })
        console.log(data)
    } catch(err) {
        console.log(err)
    }
}

exports.pkRegen = async (req, res) => { try {
    //lookup each avatar on sim, if they are below max PK, increase PK by 1
    var io = req.app.get('socketio');
    req.body.nearby.forEach(async (av) => {
        let target = await USERS.findOne({uuid: av})
        if(!target || target.ap >= target.ap_max) return;
        target.ap++
        USERS.updateOne({uuid: av}, {$set: {ap: target.ap}})
          io.emit(av, target);
    })

    res.send("PK updated")
}catch(e) { console.log(e) }}