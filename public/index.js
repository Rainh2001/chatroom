const ws = new WebSocket("ws://localhost:8080");
var field, button;

window.onload = function(){
    addEnterEvent("#field", "#send");
    field = document.getElementById("field");
    button = document.getElementById("send");
    button.addEventListener("click", function(event){
        if(field.value.length !== 0){
            ws.send(JSON.stringify({
                type: "text",
                value: field.value.trim()
            }));
        }
        field.value = "";
    });
}

// ws.onopen = function(event){

// }

ws.onmessage = function(event){
    
}

function getName(){

}

function getColor(){
    
}

function addEnterEvent(field, button){
    document.querySelector(field).addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            document.querySelector(button).click();
        }
    });
}
