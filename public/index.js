window.onload = function(){
    const socket = io(),
    chatInput = document.getElementById("chat-input"),
    sendButton = document.getElementById("send-button"),
    nameInput = document.getElementById("name-input"),
    nameButton = document.getElementById("name-button");

    var username = null;

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
    chatInput.addEventListener("keydown", function(event){
        if(chatInput.value.length && !typing){
            typing = true;
            socket.emit("typing", JSON.stringify({username}));
        } else if(!chatInput.value.length && typing){
            typing = false;
            socket.emit("stoppedtyping", JSON.stringify({username}));
        }
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

    // User connects and acquires guest name
    socket.on("guestname", function(message){
        username = message;
    });

    // User receives verification for new name
    socket.on("verifyname", function(message){
        //TODO
        username = message.username;
        nameInput.value = "";
    });

    // Receive message that user has changed their name
    socket.on("namechange", function(message){
        console.log(`${message.username} changed their name to: ${message.newName}`);
        //TODO
    });

    // Received message that user is typing
    socket.on("typing", function(message){
        console.log(`${message.username} is typing...`);
        //TODO
    });

    // Received message that user has stopped typing
    socket.on("stoppedtyping", function(message){
        console.log(`${message.username} stopped typing.`);
        //TODO
    });

    // Received chat message from another user
    socket.on("chat", function(message){
        message = JSON.parse(message);
        console.log(message);
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
