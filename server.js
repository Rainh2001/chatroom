const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 8080;

app.use(express.static(`${__dirname}/public`));

http.listen(PORT, function(){
    console.log(`Server listening on port: ${PORT}`);
});

io.on("connection", function(socket){
    console.log("User connected.");
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
        message = JSON.parse(message);
        console.log(message);
    });
    socket.on("disconnect", function(){
        console.log("User disconnected.");
    });
});

