"use strict";
var canvas, canvasWords, canvasTime, ctx, ctxWords, ctxTime;

function init() {
	canvasWords = document.getElementById("wordSpace");
	canvasTime = document.getElementById("digitalTime"); 
	ctxWords = canvasWords.getContext("2d");
	ctxTime = canvasTime.getContext("2d");
}

function tizenBackButton() {
	document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
}

window.onload = function() {
	init();
	loadUserData();
    
	listenerPassword();
	
	checkBattery();
	screenListener();
	
    printDigitalTime();
    startNewSession();   
    printFirstWord();
    buttonEventListener();
    tizenBackButton();
    
    console.log(getTime());
    console.log(JSON.stringify(wordPair));
};