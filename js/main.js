var canvasWords, canvasTime, ctxWords, ctxTime;
var words = [], translations = [];
var numberOfWords = 20;

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
	'use strict';
	var n = 0, i, j;
	var data = new FormData();
	data.append('after_date', '2016-05-05T00:00:00');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://zeeguu.unibe.ch/bookmarks_by_day?session=' + session, false);
	xhr.onload = function () {
		var obj = JSON.parse(this.responseText);
		for (i=0; i<length(obj); i++) {
			if (n > numberOfWords) {
				break;
			}
			for (j=0; j<length(obj[i].bookmarks); j++) {
				words[n] = obj[i].bookmarks[j].from;
				translations[n] = obj[i].bookmarks[j].to;
				n++;
			}
		}
	};
	xhr.send(data);
}

function startNewSession() {
	'use strict';
	var session;
	var data = new FormData();
	data.append('password', 'pass');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://zeeguu.unibe.ch/session/i@mir.lu', false);
	
	xhr.onload = function () {
		session = parseInt(this.responseText);
		console.log("session number: " + session);
		getWords(session);
	};
	xhr.send(data);
}

function printOnScreen(string, posx, posy, size) {
	'use strict';
    ctxWords.font = size + "px Arial";
	ctxWords.fillStyle = "#FFFFFF";
	ctxWords.textAlign = "center";
	ctxWords.fillText(string, posx, posy);
	// print length of word in pixels
	//var length = ctxWords.measureText(string).width;
	//console.log(length);
}

function getDate(){
	'use strict';
	var date;
	try {
		date = tizen.time.getCurrentDateTime();
	} catch (err) {
		console.error('Error: ', err.message);
	}
	return date;
}

function setBackground(hours){
	if (hours < 8) {
		document.getElementById("digitalTime").style.backgroundImage = "url('css/night.png')";
		return;
	} else if (hours < 13){
		document.getElementById("digitalTime").style.backgroundImage = "url('css/morning.png')";
		return;
	} else if (hours < 20){
		document.getElementById("digitalTime").style.backgroundImage = "url('css/afternoon.png')";
		return;
	} else if (hours < 24){
		document.getElementById("digitalTime").style.backgroundImage = "url('css/evening.png')";
		return;
	}
}

// digital time is printed on the watchface
function printDigitalTime() {
	'use strict';
	
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
	
	canvasTime = document.getElementById("digitalTime");
    ctxTime = canvasTime.getContext("2d");    
    ctxTime.clearRect(0,0,360,100);
    
    ctxTime.font = "40px Arial";
	ctxTime.fillStyle = "black";
	ctxTime.textAlign = "center";
    ctxTime.fillText(hours + ":" + minutes, 180, 95);
    
    setTimeout("printDigitalTime()",1000);
}

//function revealClicked(){ 
//    wordNumber++;
//    canvas = document.getElementById("wordSpace");
//    ctx = canvas.getContext("2d");
//    ctx.clearRect(0,0,360,140);
//    printOnScreen(translations[wordNumber], 180, 110, 20);
//}

window.onload = function() {
    'use strict';
    var wordNumber = 0;
    
    printDigitalTime();
    
    canvasWords = document.getElementById("wordSpace");
    ctxWords = canvasWords.getContext('2d');
    
    document.getElementById("nextButton").addEventListener("click", function(){
        wordNumber++;
        if (wordNumber > numberOfWords) {
        	wordNumber = 0;
        }
    	ctxWords.clearRect(0,0, 380,380);
    	printOnScreen(words[wordNumber], 180, 70, 40);
        
    });
    
    document.getElementById("revealButton").addEventListener("click", function(){
    	printOnScreen(translations[wordNumber], 180, 110, 20);
    });

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    startNewSession();
    printOnScreen(words[wordNumber], 180, 70, 40);
    
    console.log(words);
    console.log(translations);
};