const express = require('express');
const app = express();
const http = require('http');
const WebSocketServer = require('websocket').server;
const fs = require('fs');
const port = process.env.PORT || 8080;

var client = [];

app.use(express.static(`${__dirname}/public`));
const server = http.createServer(app);

server.listen(port, function(){
    console.log(`${getTime()}> Server running on port: ${port}`);
});

const ws = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

ws.on('request', function(request){
    console.log(`${getTime()}> Connection from: ${request.origin}`);
    let connection = request.accept(null, request.origin);
    client.push(connection);
    console.log(`Clients: ${client.length}`);
    connection.on('message', function(message){
        console.log(message);
        // let obj = {
        //     name: "Rain Holloway",
        //     time: getTime()
        // }
        // connection.sendUTF(JSON.stringify(obj, null, 4));
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