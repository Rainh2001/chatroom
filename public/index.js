const ws = new WebSocket("ws://localhost:8080");
var field, button;

window.onload = function(){
    addEnterEvent("#field", "#send");
    field = document.getElementById("field");
    button = document.getElementById("send");
    button.addEventListener("click", function(event){
        ws.send(field.value);
    });
}

ws.onopen = function(event){
    // document.querySelector("canvas").addEventListener("mousemove", function(event){
    //     let x = event.pageX - this.offsetLeft;
    //     let y = event.pageY - this.offsetTop;
    //     ws.send(`x${x}y${y}`);
    // });

}

ws.onmessage = function(event){
    
}

function addEnterEvent(field, button){
    document.querySelector(field).addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            document.querySelector(button).click();
        }
    });
}
