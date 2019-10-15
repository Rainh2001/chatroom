window.onload = function(){
    const nameInput = document.getElementById("name-input");
    const joinButton = document.getElementById("join-button");

    nameInput.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            joinButton.click();
        }
    });

    joinButton.addEventListener("click", function(){
        if(nameInput.value.length > 0){
            getOnline(nameInput.value, verifyName);
        }
    });

    function verifyName(username, res){
        res = JSON.parse(res);
        let found = false;
        for(let i = 0; i < res.length; i++){
            if(res[i] === username){
                found = true;
                break;
            }
        }
        if(!found){
            window.location = `/chatroom.html?username=${username}`;
        } else {
            nameInput.value = "";
            // Display "Invalid username"
        }
    }
}

function getOnline(username, customFunction){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            customFunction(username, this.responseText);
        }
    }
    xhttp.open("GET", "online.json", true);
    xhttp.send(`username=${username}`);
}