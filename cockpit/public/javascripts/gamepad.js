
////////////////////////
// *                * //
// *  GAMEPAD PART  * //
// *                * //
////////////////////////

var gamepadInfo = document.getElementById("gamepad-info");

var messageZone = document.getElementById("messageZone");
var dobby = document.getElementById(" dobby");
var commm = document.getElementById("commm");

var display_th = document.getElementById("th");
var data_th = "";

var display_tv = document.getElementById("tv");
var data_tv = "";

var gamePad;


function addGamepad(e){
    gamepadInfo.innerHTML = "Index: " + e.gamepad.index + "ID: " + e.gamepad.id;
    console.log("Index: " + e.gamepad.index + " ID: " + e.gamepad.id);
    gamePad = e.gamepad;
}

function deleteGamepad(e){
    gamepadInfo.innerHTML = "Waiting for gamepad.";
    console.log("waiting for gamepad");
    gamePad = null;
}

function axisChange(evt){
    console.log(evt.axis + ": " + evt.value)
}

window.addEventListener("gamepadconnected", addGamepad);
window.addEventListener("gamepaddisconnected", deleteGamepad);

var left_stick_x = 0;
var left_stick_y = 0;
var right_stick_x = 0;
var right_stick_y = 0;

function thrustercode(){
    data_th = "<HAV_ts>th " + -left_stick_y + "," + -left_stick_y + "\n";
    data_tv = "<HAV_ts>tv " + -right_stick_y + "\n";

    display_th.innerHTML = data_th;
    display_tv.innerHTML = data_tv;

    sendMessage(data_th);
    sendMessage(data_tv);
}

function updateControls(){
    if(gamePad){
        var myGamepad = navigator.getGamepads()[gamePad.index];

        left_stick_x = myGamepad.axes[0].toFixed(2);
        left_stick_y = myGamepad.axes[1].toFixed(2);
        right_stick_x = myGamepad.axes[2].toFixed(2);
        right_stick_y = myGamepad.axes[3].toFixed(2);

        if(Math.abs(left_stick_x) < 0.1){
            left_stick_x = 0;
        }
        if(Math.abs(left_stick_y) < 0.1){
            left_stick_y = 0;
        }
        if(Math.abs(right_stick_x) < 0.1){
            right_stick_x = 0;
        }
        if(Math.abs(right_stick_y) < 0.1){
            right_stick_y = 0;
        }
    }else {
        left_stick_x = 0;
        left_stick_y = 0;
        right_stick_x = 0;
        right_stick_y = 0;
    }

    //totally spectacular thruster code goes here, thank you very much
    thrustercode();

    setTimeout(updateControls, 200);
}

updateControls();

////////////////////////
// *                * //
// *  SOCKET PART   * //
// *                * //
////////////////////////

var socket;
var id;

var type = "control";
function chooseButo(tipe){
    type = tipe;
}

function sendMessage(msg){
    if(socket){
        if(id === ""){
            id = socket.io.engine.id;
        }

        var msgtosend = {
            "ID": id,
            "message": msg
        }
        socket.emit('datathrough', JSON.stringify(msgtosend));
    }
}

$(function () {
    socket = io();
    id = "";
    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        sendMessage(type);
        return false;
    });

    socket.on('datathrough', function(inp){
            var obj = JSON.parse(inp);
            var what = obj.ID;
            var msg = obj.message;

            if(what === "com"){
                commm.value = msg;
            }else if(what === "conn"){
                dobby.value = msg;
            }else {
                messageZone.innerHTML = messageZone.innerHTML + "\n" + msg;
            }
    });
});
