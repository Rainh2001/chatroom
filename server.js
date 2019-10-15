const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 8080;
var client = [];
var online = [];

class Client {
    constructor(socket, numId){
        let _name = null;
        // this.socket = socket;
        // this.numId = numId;
        this.setName = name => _name = name;
        this.getName = () => _name;
        this.getNumId = () => numId;
        this.getSocket = () => socket;
    }
}

app.use(express.static(`${__dirname}/public`));

http.listen(PORT, function(){
    console.log(`Server listening on port: ${PORT}`);
});

io.on("connection", function(socket){    
    (function(){
        do {
            var id = Math.floor(Math.random() * 999 + 1);
            // Use a binary search; client array is sorted by numId
        } while(client.find(function(current){
            current.getNumId() === id;
        }));
    
        let index = client.push(new Client(socket.id, id)) - 1;
        client[index].setName(`Guest${client[index].getNumId()}`);
        online.push(client[index].getName());
        console.log(`${client[index].getName()} connected`)
        socket.emit("guestname", client[index].getName());
        socket.broadcast.emit("userconnect", client[index].getName());
        
        // if(client.length > 1){
        //     let i = client.length-1;
        //     let temp = client[i];
        //     while(i > 0 && temp.getNumId() < client[i-1].getNumId()){
        //         client[i] = client[i-1];
        //         i--;
        //     }
        //     client[i] = temp;
        // }
        
        socket.emit("getonline", JSON.stringify({online}));
    })();

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
        message = JSON.parse(message);
        console.log(message);
    });

    socket.on("typing", function(message){
        socket.broadcast.emit("typing", message);
    }); 

    socket.on("stoppedtyping", function(message){
        socket.broadcast.emit("stoppedtyping", message);
    });

    socket.on("namechange", function(message){
        console.log("e");
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
                    client[i].setName(message.newName);
                    online[i] = message.newName;
                    break;
                }
            }
            io.emit("namechange", JSON.stringify(message));
        }
    });

    socket.on("disconnect", function(){
        let index = 0;
        for(let i = index; i < client.length; i++){
            if(client[i].getSocket() === socket.id){
                index = i;
            }
        }
        console.log(`${client[index].getName()} has disconnected`);
        io.emit("userdisconnect", client[index].getName());
        client.splice(index, 1);
        online.splice(index, 1);
    });
});

