var canvas, ctx;
var words = [], translations = [];
var numberOfWords = 5;

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

function printOnScreen(string, posx, posy) {
	'use strict';
	ctx.font = "20px Georgia";
	ctx.fillStyle = "FFFFFF";
	ctx.textAlign="center";
	ctx.fillText(string, posx, posy);
}

window.onload = function() {
    'use strict';
    
    var wordNumber = 0;
    
	canvas = document.querySelector(".header");
    ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
    ctx.fillText("test", 180, 80);
    
	canvas = document.querySelector(".main");
    ctx = canvas.getContext('2d');
    
    document.getElementById("nextButton").addEventListener("click", function(){
        wordNumber++;
        if (wordNumber > numberOfWords) {
        	wordNumber = 0;
        }
    	ctx.clearRect(0,0, 380,380);
    	printOnScreen(words[wordNumber], 180, 50);
        
    });
    
    document.getElementById("revealButton").addEventListener("click", function(){
    	printOnScreen(translations[wordNumber], 180, 100);
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
	printOnScreen(words[wordNumber], 180, 50);
    //printOnScreen(translations[wordNumber], 180, 100);
    console.log(words);
    console.log(translations);
};