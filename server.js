const express = require('express');
const app = express();
const http = require('http');
const WebSocketServer = require('websocket').server;
const fs = require('fs');
const PORT = process.env.PORT || 8080;

var client = [];

class Client {
    constructor(connection){
        let _name = "";
        let _color = "";
        this.setName = name => _name = name;
        this.getName = () => _name;
        this.setColor = color => _color = color;
        this.getColor = () => _color;
        this.connection = () => connection;
    }   
}   

app.use(express.static(`${__dirname}/public`));
const server = http.createServer(app);

server.listen(PORT, function(){
    console.log(`${getTime()}> Server running on port: ${PORT}`);
});

const ws = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

ws.on('request', function(request){
    console.log(`${getTime()}> Connection from: ${request.origin}`);
    let connection = request.accept(null, request.origin);
    let index = client.push(new Client(connection)) - 1;
    connection.on('message', function(message){
        message = JSON.parse(message.utf8Data);
        console.log(message);
        switch(message.type){
            case "name": client[index].setName(message.value); break;
            case "color": client[index].setColor(message.value); break;
            default:
                for(let i = 0; i < client.length; i++){
                    if(i !== index){
                        client[i].connection().sendUTF(JSON.stringify({
                            name: client[index].name,
                            color: client[index].color,
                            message: message.value
                        }, null, 4));
                    }
                }
                break;
        }
    });
    connection.on('close', function(status){
        console.log(`Connection closed: ${status}`);
        client.splice(index, 1);
    });
});

function getTime(){
    let date = new Date();
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let hours = date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    return `${hours}:${minutes}:${seconds}`;
}