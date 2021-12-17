const socket = io('ws://afterglowgame.herokuapp.com/');

const uuid = document.getElementById('uuid-data').dataset.test
let regenning = false;
let ap_regen;
var interval_starter = (user) => {
    clearTimeout(ap_regen)
    socket.emit('message', `starting timeout!`)
    ap_regen = setTimeout( () => {
        if(user.race == "demon"){
            user.ap += user.nearby_num
        }
        user.ap++
        if(user.ap > user.ap_max) {
            user.ap = user.ap_max
        }
        user.ap = parseInt(user.ap)
        socket.emit('message', `Regenning PK for ${user.slname}, with ${user.ap} ap and ${user.ap_max} max`)
        socket.emit('ap_update', user)
    } , 2000);  
}

socket.on(uuid, (user) => {
    console.log(user)
    document.getElementById('ecto-bar-span').innerHTML = `ECTO ${user.ecto}/${user.ecto_max}`;
    document.getElementById('pk-bar-span').innerHTML = `PK ${user.ap}/${user.ap_max}`;
    ap_percent = user.ap / user.ap_max * 100;
    ecto_percent = user.ecto / user.ecto_max * 100;
    document.getElementById('pk-bar').style.width = `${ ap_percent }%`;
    
    //clearTimeout(ap_regen)
    if(user.ap < user.ap_max){
       interval_starter(user);
    }  

    document.getElementById('ecto-bar').style.width = `${ecto_percent}%`;
    document.getElementById('bones-balance').innerHTML = `₿$ ${user.bone}`;
    document.getElementById('target').innerHTML = `Targeting: ${user.combat.target}`;
    // user.combat.cooldown = parseInt(user.combat.cooldown)
    document.getElementById('cooldown-1').innerHTML = `${user.combat.cooldown['1']}`;
    document.getElementById('cooldown-2').innerHTML = `${user.combat.cooldown['2']}`;
    document.getElementById('cooldown-3').innerHTML = `${user.combat.cooldown['3']}`;
    document.getElementById('cooldown-4').innerHTML = `${user.combat.cooldown['4']}`;
    if(user.combat.cooldown['1'] <= 0)
        document.getElementById('cooldown-1').innerHTML = ``;
    if(user.combat.cooldown['2'] <= 0)
        document.getElementById('cooldown-2').innerHTML = ``;
    if(user.combat.cooldown['3'] <= 0)
        document.getElementById('cooldown-3').innerHTML = ``;
    if(user.combat.cooldown['4'] <= 0)
        document.getElementById('cooldown-4').innerHTML = ``;
});

// var addPk = (user) => {
//     user.ap++
//     // ap_regen = false;
//     socket.emit('message', `Regenning PK for ${user.slname}`)
//     socket.emit('ap_update', user)
//     // if(user.ap < user.ap_max) setTimeout( addPk(user) , 1000);
// }