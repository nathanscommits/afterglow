const socket = io('ws://afterglowgame.herokuapp.com/');


socket.on('3ffd8a53-ff55-4632-8ebe-54b73b07e1a1', (user) => {
    console.log(user)
    document.getElementById('ecto-bar-span').innerHTML = `ECTO ${user.ecto}/${user.ecto_max}`;
    document.getElementById('pk-bar-span').innerHTML = `PK ${user.ap}/${user.ap_max}`;
    user.ap = user.ap / user.ap_max * 100;
    user.ecto = user.ecto / user.ecto_max * 100;
    document.getElementById('pk-bar').style.width = `${ user.ap }%`;
    document.getElementById('ecto-bar').style.width = `${user.ecto}%`;
    document.getElementById('bones-balance').innerHTML = `₿$ ${user.bone}`;
    document.getElementById('target').innerHTML = `Targeting: ${user.target}`;
    if(user.cooldown > 0) {
        document.getElementById('cooldown-1').innerHTML = `${user.cooldown}`;
        document.getElementById('cooldown-2').innerHTML = `${user.cooldown}`;
        document.getElementById('cooldown-3').innerHTML = `${user.cooldown}`;
        document.getElementById('cooldown-4').innerHTML = `${user.cooldown}`;
    } else {
        document.getElementById('cooldown-1').innerHTML = ``;
        document.getElementById('cooldown-2').innerHTML = ``;
        document.getElementById('cooldown-3').innerHTML = ``;
        document.getElementById('cooldown-4').innerHTML = ``;
    }
});