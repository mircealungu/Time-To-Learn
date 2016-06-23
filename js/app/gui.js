/**
 * gui.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['battery', 'userData', 'time'], function(battery, userData, time) {

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

	var ctxWords, ctxDate, ctxTime;
	var clicked = false;
	var reverse = false;

	function setBackground(minutes){
		var degrees = minutes / 4;
		var rotation = "rotate(" + degrees + "deg)";
		document.getElementById("timeBackground").style.transform = rotation;
	}

	function printDay(){
		ctxDate.clearRect(0,0,100,90);
		ctxDate.font = "50px Arial";
		ctxDate.fillStyle = FONT_COLOR;
		ctxDate.textAlign = CENTER;
		ctxDate.fillText(time.getDay(), 50, 60);
	}

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
		ctxTime.clearRect(0,0,SCREEN_WIDTH,DIGITAL_TIME_HEIGHT);
		ctxTime.font = TIME_FONT_SIZE + FONT;
		ctxTime.fillStyle = FONT_COLOR;
		ctxTime.textAlign = CENTER;
		ctxTime.fillText(time.getHours() + ":" + time.getMinutes(), SCREEN_WIDTH/2, DIGITAL_TIME_POSY);
	}

	function unfade(element, fadeTime) {
	    var op = 0.1;  // initial opacity
	    element.style.display = 'block';
	    var timer = setInterval(function () {
	    	if (op >= 0.8){
	    		clearInterval(timer);
	    	}
	    	element.style.opacity = op;
	    	element.style.filter = 'alpha(opacity=' + op * 100 + ")";
	    	op += op * 0.1;
	    }, fadeTime);
	}

	function fade(element, fadeTime) {
	    var op = 0.8;  // initial opacity
	    var timer = setInterval(function () {
	    	if (op <= 0.1){
	    		clearInterval(timer);
	    		element.style.visibility = "hidden";
	    	}
	    	element.style.opacity = op;
	    	element.style.filter = 'alpha(opacity=' + op * 100 + ")";
	    	op -= op * 0.1;
	    }, fadeTime);
	}

	function feedbackByImage(imgSource){
		var canvas = document.getElementById("imageFade");
		canvas.style.visibility = "visible";
		canvas.style.opacity = 1.0;
		var ctx = canvas.getContext("2d");

		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
		};
		img.src = imgSource;

		setTimeout(function(){fade(canvas,50);}, 500);
	}

	function printWordOnScreen(clicked){
		if (userData.getWordNumber() === userData.getNumberOfWords()) {
			userData.setWordNumber(0);
		}
		
		ctxWords.clearRect(0, 0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		if (clicked) {
			printOnScreen(userData.getWord(userData.getWordNumber()), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
			printOnScreen(userData.getTranslation(userData.getWordNumber()), SCREEN_WIDTH/2, TRANSLATION_POSY, TRANSLATION_FONT_SIZE);
		} else {
			printOnScreen(userData.getWord(userData.getWordNumber()), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		}
	}

	return {

		draw: function() {
			time.create();
			var totalMinutes = time.getHours()*60 + time.getMinutes();
			printDigitalTime();
			printDay();
			setBackground(totalMinutes);
			battery.draw();
		},

		create: function(ctx) {
			ctxWords = ctx;
			
			var canvasTime = document.getElementById("digitalTime"); 
			ctxTime = canvasTime.getContext("2d");

			var canvasDate = document.getElementById("dateSpace");
			ctxDate = canvasDate.getContext("2d");

			//print first word
			printWordOnScreen(clicked);

			document.getElementById("nextButton").addEventListener("click", function(){
				console.log("next button clicked");
				userData.nextWord();
				clicked = false;
				printWordOnScreen(clicked);
			});

			document.getElementById("wordSpace").addEventListener("click", function(){
				console.log("word space clicked");
				clicked = !clicked;
				if (clicked) {
					userData.addEvent("reveal");
				} else {
					userData.addEvent("hide");
				}
				printWordOnScreen(clicked);
			});

			document.getElementById("menuButton").addEventListener("click", function(){
				var canvasMenu = document.getElementById("menuPage");
				canvasMenu.style.visibility = "visible";
				var mainButtons = document.getElementById("buttons");
				mainButtons.style.visibility = "hidden";
				console.log("menu clicked");
				unfade(canvasMenu,5);
			});

			//EventListeners for the menu: back, trash, I learned it and settings
			document.getElementById("menuSpace").addEventListener("click", function(){
				var menu = document.getElementById("menuPage");
				var mainButtons = document.getElementById("buttons");
				mainButtons.style.visibility = "visible";
				fade(menu,5);
			});
			
			document.getElementById("trashButton").addEventListener("click", function(){
				userData.addEvent("trash");
				userData.deleteWordPair();
				var imgSource = "assets/trash_icon.png";
				console.log("trashbutton clicked");
				
				feedbackByImage(imgSource);
				clicked = false;
				printWordOnScreen(clicked);
			});
			
			document.getElementById("learnedButton").addEventListener("click", function(){
				userData.addEvent("learned");
				var imgSource = "assets/I_learned_it_icon.png";
				
				feedbackByImage(imgSource);
				userData.nextWord();
				clicked = false;
				printWordOnScreen(clicked);	
			});
			
			document.getElementById("backButton").addEventListener("click", function(){
				var menu = document.getElementById("menuPage");
				var mainButtons = document.getElementById("buttons");
				mainButtons.style.visibility = "visible";
				fade(menu,5);
			});
			
			document.getElementById("settingsButton").addEventListener("click", function(){
				var canvasMenu = document.getElementById("menuPage");
				fade(canvasMenu,5);
				
				var canvasSettings = document.getElementById("settingsPage");
				canvasSettings.style.visibility = "visible";
				unfade(canvasSettings,5);

			});
			
			//EventListeners for the buttons in the settings: reverse, number of words and profile
			document.getElementById("settingsSpace").addEventListener("click", function(){
				var settings = document.getElementById("settingsPage");
				var mainButtons = document.getElementById("buttons");
				mainButtons.style.visibility = "visible";
				fade(settings,5);

			});
			
			document.getElementById("reverseButton").addEventListener("click", function(){
				userData.addEvent("reverse");
				clicked = false;
				reverse = !reverse;
				userData.setReverseStatus(!userData.getReverseStatus());
				printWordOnScreen(clicked);	
			});
			
			document.getElementById("logOutButton").addEventListener("click", function(){
				userData.setCode(0);
				document.location.reload(true);
			});
			
			document.getElementById("menuButtonInSettings").addEventListener("click", function(){
				var canvasSettings = document.getElementById("settingsPage");
				fade(canvasSettings,5);
				
				var canvasMenu = document.getElementById("menuPage");
				canvasMenu.style.visibility = "visible";
				console.log("menu clicked");
				unfade(canvasMenu,5);
			});
			
			document.getElementById("backButtonInSettings").addEventListener("click", function(){
				var settings = document.getElementById("settingsPage");
				var mainButtons = document.getElementById("buttons");
				mainButtons.style.visibility = "visible";
				fade(settings,5);
			});
		},
	};
});