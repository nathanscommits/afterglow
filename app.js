const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// const secure = require('ssl-express-www');


app.set('subdomain offset', 0);
app.set("views", "views");
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
// app.use(secure);
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(express.json());
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

app.set('socketio', io)
const USERS = require("./db").db().collection("USERS");
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('ap_update', (user) => {
        // const update = spellController.apUpdate(user)
        await USERS.updateOne({uuid: user.uuid}, {$set: {ap: parseInt(user.ap)}}, {upsert: true})
        io.emit(user.uuid, user );   
    })
    socket.on('3ffd8a53-ff55-4632-8ebe-54b73b07e1a1', (message) =>     {
        console.log(message);
        //io.emit('message', `${socket.id.substr(0,2)} said ${message}` );   
    });
});
    
const router = require("./router");
app.use("/", router);
module.exports = server;
