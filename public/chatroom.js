window.onload = function(){
    const socket = io(),
    chatInput = document.getElementById("chat-input"),
    sendButton = document.getElementById("send-button"),
    nameInput = document.getElementById("name-input"),
    nameButton = document.getElementById("name-button");

    var username = null;
    var online = [];

    nameInput.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            nameButton.click();
        }
    });

    nameButton.addEventListener("click", function(event){
        let newName = nameInput.value;
        socket.emit("namechange", JSON.stringify({
            username, newName
        }));
    });

    let typing = false;
    chatInput.addEventListener("keyup", function(event){
        setTimeout(function(){
            if(chatInput.value.length && !typing){
                typing = true;
                socket.emit("typing", username);
            } else if(chatInput.value.length === 0 && typing){
                typing = false;
                socket.emit("stoppedtyping", username);
            }
        }, 1);
    });

    chatInput.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            sendButton.click();
        }
    });

    sendButton.addEventListener("click", function(event){
        let text = chatInput.value;
        if(text.length){
            let obj = JSON.stringify({
                time: getTime(),
                username,
                text
            });
            socket.emit("chat", obj);
            chatInput.value = "";
        }
    });

    socket.on("getonline", function(message){
        message = JSON.parse(message);
        online = message.online
        console.log(online);
    });

    // User receives verification for new name
    socket.on("verifyname", function(message){
        message = JSON.parse(message);
        if(message.valid){
            username = message.username;
            nameInput.value = "";
        } else {
            console.log(`${message.username} is already taken`);
        }
        //TODO
    });

    // Receive message that user has changed their name
    socket.on("namechange", function(message){
        message = JSON.parse(message);
        console.log(`${message.username} changed their name to: ${message.newName}`);
        //TODO
    });

    // Received message that user is typing
    socket.on("typing", function(message){
        console.log(`${message} is typing...`);
        //TODO
    });

    // Received message that user has stopped typing
    socket.on("stoppedtyping", function(message){
        console.log(`${message} stopped typing`);
        //TODO
    });

    // Received chat message from another user
    socket.on("chat", function(message){
        message = JSON.parse(message);
        console.log(`[${message.time}] ${message.username}: ${message.text}`);
        //TODO
    });

    // Update online list: add user
    socket.on("userconnect", function(message){
        console.log(`${message} has connected`); 
        online.push(message);
        console.log(online);
        //TODO
    });

    // Update online list: remove user
    socket.on("userdisconnect", function(message){
        console.log(`${message} has disconnected`);
        for(let i = 0; i < online.length; i++){
            if(online[i] === message){
                online.splice(i, 1);
                break;
            }
        }
        console.log(online);
        //TODO
    });

}

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
