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
    document.getElementsByClassName('cooldown').innerHTML = `${user.cooldown}`;
});