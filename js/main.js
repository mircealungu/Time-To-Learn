'use strict';
var canvas, canvasWords, canvasTime, ctx, ctxWords, ctxTime;
var words = [], translations = [];
var numberOfWords = 50;

//definitions backgroundImages
var NIGHT = "url('css/night.png')";
var MORNING = "url('css/morning.png')";
var AFTERNOON = "url('css/afternoon.png')";
var EVENING = "url('css/evening.png')";

//definitions about text
var FONT = "px Arial";
var TIME_FONT_SIZE = 120;
var WORD_FONT_SIZE = 45;
var TRANSLATION_FONT_SIZE = 35;
var CENTER = "center";

//definitions of colors
var WHITE = "white";
var BLACK = "black";

//definitions for connection server
var SESSION_ENDPOINT = 'https://zeeguu.unibe.ch/';
var BOOKMARK_SESSION = 'bookmarks_by_day?session=';
var USERNAME = 'session/i@mir.lu';

//definitions for coordinates
var SCREEN_WIDTH = 360;
var SCREEN_HEIGHT = 360;
var DIGITAL_TIME_HEIGHT = 160;
var DIGITAL_TIME_POSY = 130;
var WORDSPACE_HEIGHT = 140;
var WORD_POSY = 55;
var TRANSLATION_POSY = 115;

//window.requestAnimationFrame = window.requestAnimationFrame ||
//	window.webkitRequestAnimationFrame ||
//	window.mozRequestAnimationFrame ||
//	window.oRequestAnimationFrame ||
//	window.msRequestAnimationFrame ||
//	function(callback) {
//    	'use strict';
//    	window.setTimeout(callback, 1000 / 60);
//	};

function length(obj) {
    return Object.keys(obj).length;
}

function getWords(session) {
	var n = 0, i, j;
	var data = new FormData();
	data.append('after_date', '2016-05-05T00:00:00');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', SESSION_ENDPOINT + BOOKMARK_SESSION + session, false);
	xhr.onload = function () {
		var obj = JSON.parse(this.responseText);
		for (i=0; i<length(obj); i++) {
			if (n > numberOfWords) {
				break;
			}
			for (j=0; j<length(obj[i].bookmarks); j++) {
				ctxWords.font = WORD_FONT_SIZE + FONT;
				// sentences and words that do not fit on the screen, leave them out
				if (ctxWords.measureText(String(obj[i].bookmarks[j].from)).width <= SCREEN_WIDTH - 10) {
					ctxWords.font = TRANSLATION_FONT_SIZE + FONT;
					if (ctxWords.measureText(String(obj[i].bookmarks[j].to)).width <= SCREEN_WIDTH - 10) {
						words[n] = obj[i].bookmarks[j].from;
						translations[n] = obj[i].bookmarks[j].to;
						n++;
					}
				}
			}
		}
	};
	xhr.send(data);
}

function startNewSession() {
	var session;
	var data = new FormData();
	data.append('password', 'pass');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', SESSION_ENDPOINT + USERNAME, false);
	
	xhr.onload = function () {
		session = parseInt(this.responseText);
		console.log("session number: " + session);
		getWords(session);
	};
	xhr.send(data);
}

function printOnScreen(string, posx, posy, size) {
	ctxWords.font = size + FONT;
	ctxWords.fillStyle = WHITE;
	ctxWords.textAlign = CENTER;
	ctxWords.fillText(string, posx, posy);
	// print length of word in pixels
	var length = ctxWords.measureText(string).width;
	console.log(length);
}

function getDate(){
	var date;
	try {
		date = tizen.time.getCurrentDateTime();
	} catch (err) {
		console.error('Error: ', err.message);
	}
	return date;
}

function setBackground(hours){
	var backgroundImage;
	if (hours < 8) {
		backgroundImage = NIGHT;
	} else if (hours < 13){
		backgroundImage = MORNING;
	} else if (hours < 20){
		backgroundImage = AFTERNOON;
	} else {
		backgroundImage = EVENING;
	}
	document.getElementById("digitalTime").style.backgroundImage = backgroundImage;
}

// digital time is printed on the watchface
function printDigitalTime() {	
	var date = getDate();
	var hours = date.getHours();
    var minutes = date.getMinutes();
	
	if(hours<10){
		hours = "0" + hours;
	}
	if(minutes<10){
		minutes = "0" + minutes;
	}
	
	setBackground(hours);
	
    ctxTime.clearRect(0,0,SCREEN_WIDTH,DIGITAL_TIME_HEIGHT);
    
	ctxTime.font = TIME_FONT_SIZE + FONT;
	ctxTime.fillStyle = BLACK;
	ctxTime.textAlign = CENTER;
    ctxTime.fillText(hours + ":" + minutes, SCREEN_WIDTH/2, DIGITAL_TIME_POSY);
    
    setTimeout(printDigitalTime,1000);
}

function buttonEventListener() {
	var wordNumber = 0;
	document.getElementById("nextButton").addEventListener("click", function(){
	    wordNumber++;
	    if (wordNumber > numberOfWords) {
	    	wordNumber = 0;
	    }
		ctxWords.clearRect(0,0, SCREEN_WIDTH,SCREEN_HEIGHT);
		printOnScreen(words[wordNumber], SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
	    
	});
	
	document.getElementById("revealButton").addEventListener("click", function(){
		ctxWords.clearRect(0,0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		printOnScreen(words[wordNumber], SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		printOnScreen(translations[wordNumber], SCREEN_WIDTH/2, TRANSLATION_POSY, TRANSLATION_FONT_SIZE);
	});
}

function erasePasswordDigits(){
	ctx.clearRect(0,0, 360, 110);
	return 0;
}

function printPasswordDigit(number, digits){
	ctx.font = "50px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText(number, 270 - (digits-1)*60, 90);
}

function passwordButtonPressed(number, digits, inNumber){
	if (digits>0){
		inNumber = inNumber + number * Math.pow(10,digits-1);
		printPasswordDigit(number, digits);
		console.log("inserted number: " + inNumber);
	}
	return inNumber;
}

function accountCode(){
	var code = 1234;
	return code;
}

function listenerPassword() {
	var digits = 4;
	var insertedNumber = 0;
	
	canvas = document.getElementById("digitSpace"); 
	ctx = canvas.getContext("2d");
	
	document.getElementById("oneButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("1", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("twoButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("2", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("threeButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("3", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("fourButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("4", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("fiveButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("5", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("sixButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("6", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("sevenButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("7", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("eightButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("8", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("nineButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("9", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("zeroButton").addEventListener("click", function(){
		insertedNumber = passwordButtonPressed("0", digits, insertedNumber);
		digits = digits - 1;
	});
	document.getElementById("deleteButton").addEventListener("click", function(){
		insertedNumber = erasePasswordDigits();
		digits = 4;
	});
	
	document.getElementById("okayButton").addEventListener("click", function(){
		if (digits===0){
			console.log("d = 0 | inserted number: " + insertedNumber);
			console.log("needed number: " + accountCode());
			if (insertedNumber===accountCode()){
				var d1,d2;
				
				d1 = document.getElementById("login");
				d2 = document.getElementById("mainPage");
				   
				d1.style.display = "none";
				d2.style.display = "block";
			}else{
				insertedNumber = erasePasswordDigits();
				digits = 4;
			}
		}
	});

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

function printFirstWord(){
	printOnScreen(words[0], SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
}

function init() {
	canvasWords = document.getElementById("wordSpace");
	canvasTime = document.getElementById("digitalTime"); 
	ctxWords = canvasWords.getContext("2d");
	ctxTime = canvasTime.getContext("2d");
}

window.onload = function() {
	init();
    
	listenerPassword();
	
    printDigitalTime();
    startNewSession();   
    printFirstWord();
    buttonEventListener();
    tizenBackButton();
    
    console.log(words);
    console.log(translations);
};