const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 8080;
var client = [];

class Client {
    constructor(socket, numId){
        let _name = null;
        // this.socket = socket;
        // this.numId = numId;
        this.setName = name => _name = name;
        this.getName = () => name;
        this.getNumId = () => numId;
        this.getSocket = () => socket;
    }
}

app.use(express.static(`${__dirname}/public`));

http.listen(PORT, function(){
    console.log(`Server listening on port: ${PORT}`);
});

io.on("connection", function(socket){
    console.log("User connected.");
    
    do {
        var id = Math.floor(Math.random() * 999 + 1);
    } while(client.find(function(current){
        current.getNumId() === id;
    }));

    let index = client.push(new Client(socket.id, id)) - 1;
    socket.emit("guestname", `Guest${client[index].getNumId()}`);
    
    if(client.length > 1){
        let i = client.length-1;
        let temp = client[i];
        while(i > 0 && temp.getNumId() < client[i-1].getNumId()){
            client[i] = client[i-1];
            i--;
        }
        client[i] = temp;
    }

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
        message = JSON.parse(message);
        console.log(message);
    });

    socket.on("disconnect", function(){
        console.log("User disconnected.");
        for(let i = 0; i < client.length; i++){
            if(client[i].getSocket() === socket.id){
                client.splice(i, 1);
            }
        }
    });
});

