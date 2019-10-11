const express = require('express');
const app = express();
const http = require('http');
const WebSocketServer = require('websocket').server;
const fs = require('fs');
const PORT = process.env.PORT || 8080;

var client = [];

class Client {
    constructor(connection){
        this.connection = connection;
    }   
    setName(name){
        this.name = name;
    }
    setColor(color){
        this.color = color;
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
        let text = message.utf8Data;
        if(text.slice(0, 4) === "name"){
            client[index].setName(text.slice(4).trim());
        } else if(text.slice(0, 5) === "color"){
            client[index].setColor(text.slice(5).trim());
        } else {
            client.forEach(client => {
                client.connection.sendUTF(JSON.stringify({
                    name: client[index].name,
                    color: client[index].color,
                    message: text
                }, null, 4));
            });
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