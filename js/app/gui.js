/**
 * gui.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['battery', 'userData', 'time', 'weather'], function(battery, userData, time, weather) {

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
	var SCREEN_HEIGHT_WORDSPACE = 120;
	var DIGITAL_TIME_HEIGHT = 180;
	var DIGITAL_TIME_POSY = 160;
	var WORDSPACE_HEIGHT = 120;
	var WORD_POSY = 45;
	var TRANSLATION_POSY = 95;
	
	//definitions for fading time in milliseconds
	var FADING_TIME = 20;
	var TIME_BEFORE_FADING_STARTS = 100;

	var ctxWords, ctxDate, ctxTime;
	var doubleTapTimer = null;
	var sunrise,sunset, degrees, rotation;

	function setBackground(minutes){
		sunrise = weather.getSunrise();
		sunset = weather.getSunset();
		
		if(minutes >= sunrise && minutes <= sunset) {
			degrees = (180 / (sunset - sunrise)).toFixed(2);
			degrees = 90 * 1 + (minutes - sunrise) * degrees;
			rotation = "rotate(" + degrees + "deg)";
			document.getElementById("timeBackground").style.transform = rotation;
		} else {
			degrees = (180 / (sunrise + (1440 - sunset))).toFixed(2);
			if(minutes > sunset) {
				degrees = 270 * 1 + (minutes - sunset) * degrees;
			} else {
				degrees = 270 * 1 + (minutes + (1440 - sunset)) * degrees;
			}
			rotation = "rotate(" + degrees + "deg)";
			document.getElementById("timeBackground").style.transform = rotation;
		}
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
			ctx.drawImage(img, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT_WORDSPACE);
		};
		img.src = imgSource;

		setTimeout(function(){fade(canvas,FADING_TIME);}, TIME_BEFORE_FADING_STARTS);
	}

	function printWord(){
		
		document.getElementById("wordSpace").style.backgroundImage = "url('assets/background.png')";

		ctxWords.clearRect(0, 0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		printOnScreen(userData.getWord(), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		
		var canvasRevealPage = document.getElementById("revealedPage");
		canvasRevealPage.style.visibility = "hidden";
	}
	
	function revealTranslation(){
		userData.addEvent("reveal");
		ctxWords.clearRect(0, 0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		printOnScreen(userData.getWord(), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		printOnScreen(userData.getTranslation(), SCREEN_WIDTH/2, TRANSLATION_POSY, TRANSLATION_FONT_SIZE);
		
		document.getElementById("wordSpace").style.backgroundImage = "url('assets/revealed_clicked_background.png')";
		var canvasRevealPage = document.getElementById("revealedPage");
		canvasRevealPage.style.visibility = "visible";
	}
	
	function showSettings(){
		var settings = document.getElementById("settingsPage");
		settings.style.visibility = "visible";
		unfade(settings,5);
	}
	
	function showMenu(){
		var menu = document.getElementById("menuPage");
		menu.style.visibility = "visible";
		unfade(menu,5);
	}
	
	function doubleTapHandler(func) {
		if (doubleTapTimer === null) {
			// handle single tap
			doubleTapTimer = setTimeout(function () {
				doubleTapTimer = null;
				func();
			}, 300);
		} else {
			// handle double tap
			clearTimeout(doubleTapTimer);
			doubleTapTimer = null;
			showSettings();
		}
	}

	function drawWeather() {
		var canvas = document.getElementById("weatherSpace");
		var ctx = canvas.getContext("2d");

		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
		};
		img.src = weather.getImageSource();
	}

	function drawTemperature() {
	}

	return {

		draw: function() {
			time.create();
			var totalMinutes = time.getHours()*60 + time.getMinutes()*1;
			printDigitalTime();
			printDay();
			setBackground(totalMinutes);
			battery.draw();
			drawWeather();
		},

		create: function(ctx) {
			ctxWords = ctx;
			
			var canvasTime = document.getElementById("digitalTime"); 
			ctxTime = canvasTime.getContext("2d");

			var canvasDate = document.getElementById("dateSpace");
			ctxDate = canvasDate.getContext("2d");
			
			//init weather
			weather.refresh();

			//print first word
			printWord();
			
			//EventListeners for revealing the translation (the user can click the word space or the button)
			//By double tapping on the word space, the settings appears
			document.getElementById("wordSpace").addEventListener("click", function(){
				doubleTapHandler(revealTranslation);
			});
			
			document.getElementById("revealButton").addEventListener("click", function(){
				revealTranslation();
			});
			
			//EventListeners for the revealedPage: wrong, menu, right
			// By double tapping on the menu space, the settings appears
			document.getElementById("wrongSpace").addEventListener("click", function(){
				userData.addEvent("wrong");
				var imgSource = "assets/wrong_icon.png";
				
				userData.flashCardMethod(false);
				feedbackByImage(imgSource);
				printWord();
			});
			document.getElementById("wrongButton").addEventListener("click", function(){
				userData.addEvent("wrong");
				var imgSource = "assets/wrong_icon.png";
				
				userData.flashCardMethod(false);
				feedbackByImage(imgSource);
				printWord();
			});
			
			document.getElementById("menuSpace").addEventListener("click", function(){
				doubleTapHandler(showMenu);
			});
			document.getElementById("menuButton").addEventListener("click", function(){
				showMenu();
			});
			
			document.getElementById("rightSpace").addEventListener("click", function(){
				userData.addEvent("right");
				var imgSource = "assets/right_icon.png";
				
				userData.flashCardMethod(true);
				feedbackByImage(imgSource);
				printWord();	
			});
			document.getElementById("rightButton").addEventListener("click", function(){
				userData.addEvent("right");
				time.setTest();
				var imgSource = "assets/right_icon.png";
				
				userData.flashCardMethod(true);
				feedbackByImage(imgSource);
				printWord();	
			});
			
			//EventListeners for the buttons in the menu: wrong translation, I learned it!
			document.getElementById("menuLargeSpace").addEventListener("click", function(){
				var menu = document.getElementById("menuPage");
				fade(menu,5);
			});
			
			document.getElementById("wrongTranslationButton").addEventListener("click", function(){
				userData.addEvent("wrongTranslation");
				console.log(userData.getWord(userData.getWordNumber()) + " - " + userData.getTranslation(userData.getWordNumber()) + ": has a wrong translation");
				
				var imgSource = "assets/trash_icon.png";
				feedbackByImage(imgSource);
				printWord();
			});
			
			document.getElementById("learnedButton").addEventListener("click", function(){
				userData.addEvent("learnedIt");
				console.log(userData.getWord(userData.getWordNumber()) + " - " + userData.getTranslation(userData.getWordNumber()) + ": is learned");
				
				var imgSource = "assets/right_icon.png";
				feedbackByImage(imgSource);
				printWord();
			});
			
			document.getElementById("backButtonInMenu").addEventListener("click", function(){
				var menu = document.getElementById("menuPage");
				fade(menu,5);
			});
			
			//EventListeners for the buttons in the settings: reverse, number of words and profile
			document.getElementById("settingsSpace").addEventListener("click", function(){
				var settings = document.getElementById("settingsPage");
				fade(settings,5);
			});
			
			document.getElementById("reverseButton").addEventListener("click", function(){
				userData.addEvent("reverse");
				userData.setReverseStatus(!userData.getReverseStatus());
				userData.setWordNumber(userData.getWordNumber() - 1);
				printWord();	
			});
			
			document.getElementById("logOutButton").addEventListener("click", function(){
				userData.setCode(0);
				document.location.reload(true);
			});
			
			document.getElementById("backButtonInSettings").addEventListener("click", function(){
				var settings = document.getElementById("settingsPage");
				fade(settings,5);
			});
		},
	};
});