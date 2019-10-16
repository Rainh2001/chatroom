const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const PORT = 8080;
var client = [];
var online = [];

class Client {
    constructor(socket, name){
        // this.socket = socket;
        // this.name = name;
        this.setName = newName => name = newName;
        this.getName = () => name;
        this.getSocket = () => socket;
    }
}

app.use(express.static(`${__dirname}/public`));

http.listen(PORT, function(){
    console.log(`Server listening on port: ${PORT}`);
});

app.get("online.json", function(req, res){
    let onlineArr = fs.readFile("/public/online.json", function(){
        res.json(onlineArr);
    });
});

io.on("connection", function(socket){    
    let url = socket.handshake.headers.referer;
    username = url.slice(url.indexOf("=") + 1);
    let verified = true;

    (function(){

        for(let i = 0; i < online.length; i++){
            if(username === online[i]){
                verified = false;
                break;
            }
        }
    
        if(verified){
            console.log(`[${getTime()}] ${username} connected`)
    
            client.push(new Client(socket.id, username));
            online.push(username);
            fs.writeFileSync("public/online.json", JSON.stringify(online, null, 4));

            socket.broadcast.emit("userconnect", username);
            socket.emit("verifyname", JSON.stringify({
                username,
                valid: true
            }));
            socket.emit("getonline", JSON.stringify({online}));
        } else {
            socket.emit("unverified", "index.html?valid=false");
        }

    })();

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
        message = JSON.parse(message);
        console.log(`[${message.time}] ${message.username}: ${message.text}`);
    });

    socket.on("typing", function(message){
        socket.broadcast.emit("typing", message);
    }); 

    socket.on("stoppedtyping", function(message){
        socket.broadcast.emit("stoppedtyping", message);
    });

    socket.on("namechange", function(message){
        message = JSON.parse(message);
        let found = false;
        let i = 0;
        while(i < client.length && !found){
            if(message.newName === client[i].getName()){
                found = true;
            }
            i++;
        }
        socket.emit("verifyname", JSON.stringify({
            username: message.newName,
            valid: !found
        }));
        if(!found){
            let index = 0;
            for(let i = index; i < client.length; i++){
                if(client[i].getSocket() === socket.id){
                    console.log(`[${getTime()}] ${online[i]} changed their name to: ${message.newName}`);
                    client[i].setName(message.newName);
                    online[i] = message.newName;
                    fs.writeFileSync("public/online.json", JSON.stringify(online, null, 4));
                    break;
                }
            }
            io.emit("namechange", JSON.stringify(message));
        }
    });

    socket.on("disconnect", function(){
        if(verified){
            let index = 0;
            for(let i = index; i < client.length; i++){
                if(client[i].getSocket() === socket.id){
                    index = i;
                }
            }
            console.log(`[${getTime()}] ${client[index].getName()} has disconnected`);
            io.emit("userdisconnect", client[index].getName());
            client.splice(index, 1);
            online.splice(index, 1);
            fs.writeFileSync("public/online.json", JSON.stringify(online, null, 4));
        }
    });
});

function getTime(){
    let date = new Date();
    let hours = date.getHours();
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
}