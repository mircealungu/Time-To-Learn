//definitions about text
var FONT = "px Arial";
var TIME_FONT_SIZE = 120;
var WORD_FONT_SIZE = 45;
var TRANSLATION_FONT_SIZE = 35;
var CENTER = "center";
var FONT_COLOR = "white";

//definitions for coordinates
var SCREEN_WIDTH = 360;
var SCREEN_HEIGHT = 360;
var DIGITAL_TIME_HEIGHT = 180;
var DIGITAL_TIME_POSY = 160;
var WORDSPACE_HEIGHT = 120;
var WORD_POSY = 45;
var TRANSLATION_POSY = 95;

function printOnScreen(string, posx, posy, size) {
	ctxWords.font = size + FONT;
	ctxWords.fillStyle = FONT_COLOR;
	ctxWords.textAlign = CENTER;
	ctxWords.fillText(string, posx, posy);
	// print length of word in pixels
	//var length = ctxWords.measureText(string).width;
	//console.log(length);
}

function printDigitalTime() {	
	var date = getTizenDateTime();
	var day = date.getDate();
	//var month = date.getMonth()+1;
	var hours = date.getHours();
    var minutes = date.getMinutes();
    var totalMinutes = hours*60 + minutes;
	
	if(hours<10){
		hours = "0" + hours;
	}
	if(minutes<10){
		minutes = "0" + minutes;
	}
	
	//can be optimized
	printDay(day);
	
	setBackground(totalMinutes);
	
    ctxTime.clearRect(0,0,SCREEN_WIDTH,DIGITAL_TIME_HEIGHT);
    
	ctxTime.font = TIME_FONT_SIZE + FONT;
	ctxTime.fillStyle = FONT_COLOR;
	ctxTime.textAlign = CENTER;
    ctxTime.fillText(hours + ":" + minutes, SCREEN_WIDTH/2, DIGITAL_TIME_POSY);
    
    setTimeout(printDigitalTime,1000);
}

function printDay(day){
	var canvasDate = document.getElementById("dateSpace");
	var ctxDate = canvasDate.getContext("2d");
	
	ctxDate.clearRect(0,0,100,90);
    
	ctxDate.font = "50px Arial";
	ctxDate.fillStyle = FONT_COLOR;
	ctxDate.textAlign = CENTER;
    ctxDate.fillText(day, 50, 60);
	
}

function printFirstWord(){
	printOnScreen(wordPair[0].word, SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
}

function setBackground(minutes){
	var degrees = minutes / 4;
	var rotation = "rotate(" + degrees + "deg)";
	document.getElementById("timeBackground").style.transform = rotation;
}

function buttonEventListener() {
	var wordNumber = 0;
	var clicked = false;

	document.getElementById("nextButton").addEventListener("click", function(){
		wordNumber++;
		if (wordNumber > numberOfWords) {
			wordNumber = 0;
		}
		ctxWords.clearRect(0,0, SCREEN_WIDTH,SCREEN_HEIGHT);
		printOnScreen(wordPair[wordNumber].word, SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		clicked = false;

	});

	document.getElementById("wordSpace").addEventListener("click", function(){
		if (!clicked) {
			ctxWords.clearRect(0,0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
			printOnScreen(wordPair[wordNumber].word, SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
			printOnScreen(wordPair[wordNumber].translation, SCREEN_WIDTH/2, TRANSLATION_POSY, TRANSLATION_FONT_SIZE);
			clicked = true;
		} else {
			ctxWords.clearRect(0,0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
			printOnScreen(wordPair[wordNumber].word, SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
			clicked = false;
		}
	});
}

function screenListener() {
	try {
		tizen.power.setScreenStateChangeListener(function(prevState, currState) {
			if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
				console.log("We just woke up");
//				events[numberOfEvents++] = {
//						"eventType": "screenOn",
//						"time": obj[i].bookmarks[j].to,
//						"id": obj[i].bookmarks[j].id
//				};
                location.reload();
			} else {
				console.log("The display has been switched off");
			}
		});
	} catch (e) {}
	setTimeout(screenListener, 1000);
}