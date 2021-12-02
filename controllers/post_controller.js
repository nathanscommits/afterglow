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