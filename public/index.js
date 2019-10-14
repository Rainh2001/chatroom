var socket, chatInput, sendButton,
    nameInput, nameButton;

window.onload = function(){
    socket = io();
    chatInput = document.getElementById("chat-input");
    sendButton = document.getElementById("send-button");
    nameInput = document.getElementById("name-input");
    nameButton = document.getElementById("name-button");

    var username = `Guest${Math.floor(Math.random()*999 + 1)}`

    nameInput.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            nameButton.click();
        }
    });

    nameButton.addEventListener("click", function(event){
        username = nameInput.value;
        nameInput.value = "";
        //TODO: broadcast name change to other sockets
    });

    let typing = false;
    chatInput.addEventListener("keydown", function(event){
        if(chatInput.value.length && !typing){
            typing = true;
            //TODO: broadcast to other sockets that ${username} is typing

        } else if(!chatInput.value.length && typing){
            typing = false;
            //TODO: broadcast to other sockets that ${username} isn't typing anymore
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

    socket.on("typing", function(message){
        //TODO
    });

    socket.on("chat", function(message){
        message = JSON.parse(message);
        console.log(message);
    });

    socket.on("namechange", function(message){
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
