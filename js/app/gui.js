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
	var TEMPERATURE_FONT = "17px Arial";

	//definitions for coordinates
	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;
	var SCREEN_HEIGHT_WORDSPACE = 120;
	var DIGITAL_TIME_HEIGHT = 180;
	var DIGITAL_TIME_POSY = 160;
	var WORDSPACE_HEIGHT = 120;
	var WORD_POSY = 45;
	var TRANSLATION_POSY = 95;
	var DATE_WIDTH = 100;
	var DATE_HEIGHT = 90;
	var DATE_POSX = 72;
	var DATE_POSY = 63;
	var TEMPERATURE_SPACE = 50;
	var TEMPERATURE_POS = 25;
	
	
	//definitions for fading time in milliseconds
	var FADING_TIME = 20;
	var TIME_BEFORE_FADING_STARTS = 100;

	var MINUTES_IN_ONE_DAY = 1440;
	var BACKGROUND_SIZE = "360px 180px";

	var ctxWords, ctxDate, ctxTime;
	var doubleTapTimer = null;

	var backgroundNumber = 0;
	var backgroundSource = ["url('assets/countryside_background.png')", 
	                        "url('assets/city_background.png')", 
	                        "url('assets/simple_background.png')"];
	var sunrise,sunset, degrees, rotation;

	function setBackground(minutes){
		sunrise = weather.getSunrise();
		sunset = weather.getSunset();
		
		if(minutes >= sunrise && minutes <= sunset) {
			degrees = (180 / (sunset - sunrise)).toFixed(2);
			degrees = 90 + (minutes - sunrise) * degrees;
			rotation = "rotate(" + degrees + "deg)";
			document.getElementById("timeBackground").style.transform = rotation;
		} else {
			degrees = (180 / (sunrise + (MINUTES_IN_ONE_DAY - sunset))).toFixed(2);
			if(minutes > sunset) {
				degrees = 270 + (minutes - sunset) * degrees;
			} else {
				degrees = 270 + (minutes + (MINUTES_IN_ONE_DAY - sunset)) * degrees;
			}
			rotation = "rotate(" + degrees + "deg)";
			document.getElementById("timeBackground").style.transform = rotation;
		}
	}

	function printDate(){
		ctxDate.clearRect(0,0,DATE_WIDTH,DATE_HEIGHT);
		ctxDate.font = "30px Arial";
		ctxDate.fillStyle = FONT_COLOR;
		ctxDate.textAlign = CENTER;
		ctxDate.fillText(time.getDay(), DATE_POSX, DATE_POSY);
	}

	function printOnScreen(string, posx, posy, size) {
			ctxWords.font = size + FONT;
			ctxWords.fillStyle = FONT_COLOR;
			ctxWords.textAlign = CENTER;
			ctxWords.fillText(string, posx, posy);
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
		weather.setIsRefreshed(false);
		var canvas = document.getElementById("weatherSpace");
		var ctx = canvas.getContext("2d");
		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
		};
		img.src = weather.getImageSource();
	}
	
	function drawTemperature() {
		var canvas = document.getElementById("temperatureSpace");
		var ctx = canvas.getContext("2d");
		
		ctx.clearRect(0,0,TEMPERATURE_SPACE,TEMPERATURE_SPACE);
		ctx.font = TEMPERATURE_FONT;
		ctx.fillStyle = FONT_COLOR;
		ctx.textAlign = CENTER;
		ctx.fillText(weather.getTemperature() + "°C", TEMPERATURE_POS, TEMPERATURE_POS);
	}

	function right() {
		userData.addEvent("right");
		userData.saveCurrentState();
		userData.saveEvents();
		userData.sendEvents();
		var imgSource = "assets/right_icon.png";

		userData.improvedFlashCardMethod(true);
		feedbackByImage(imgSource);
		printWord();	
	}

	function wrong() {
		userData.addEvent("wrong");
		userData.saveCurrentState();
		userData.saveEvents();
		userData.sendEvents();
		var imgSource = "assets/wrong_icon.png";

		userData.improvedFlashCardMethod(false);
		feedbackByImage(imgSource);
		printWord();
	}

	function menuButton(imgSource) {
		if (userData.removeWord()) {
			feedbackByImage(imgSource);
			userData.saveCurrentState();
			userData.saveEvents();
			userData.saveWordPair();
			userData.sendEvents();
			printWord();
		} else {
			console.log("show popup");
			var canvas = document.getElementById("imageFade");
			canvas.style.visibility = "visible";
			canvas.style.opacity = 0.8;
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT / 2);
			
			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			
			ctx.fillText("TOO FEW WORDS", SCREEN_WIDTH / 2, POPUP_TEXT_LINE1);
			ctx.fillText("there are too", SCREEN_WIDTH / 2, POPUP_TEXT_LINE2);
			ctx.fillText("few words left to", SCREEN_WIDTH / 2, POPUP_TEXT_LINE3);
			ctx.fillText("use this option", SCREEN_WIDTH / 2, POPUP_TEXT_LINE4);
			
			setTimeout(function(){fade(canvas,FADING_TIME);}, WAITING_TIME_FOR_POPUP_TO_DISAPPEAR);
		}
	}

	return {

		draw: function() {
			time.create();
			var totalMinutes = time.getHours()*60 + time.getMinutes()*1;
			printDigitalTime();
			printDate();
			setBackground(totalMinutes);
			battery.draw();
			if (weather.getIsRefreshed()) {
				drawWeather();
			}
			drawTemperature();
		},

		create: function(ctx) {
			ctxWords = ctx;
			
			var canvasTime = document.getElementById("digitalTime"); 
			ctxTime = canvasTime.getContext("2d");

			var canvasDate = document.getElementById("iconSpace");
			ctxDate = canvasDate.getContext("2d");
			
			weather.refresh(true);
			userData.initializeIntervals();

			//print first word
			printWord();
			
			//EventListeners for revealing the translation (the user can click the word space or the button)
			//By double tapping on the word space, the settings appears
			document.getElementById("wordSpace").addEventListener("click", function(){
				userData.addEvent("reveal");
				doubleTapHandler(revealTranslation);
				userData.saveEvents();
			});
			
			document.getElementById("revealButton").addEventListener("click", function(){
				userData.addEvent("reveal");
				revealTranslation();
				userData.saveEvents();
			});
			
			//EventListeners for the revealedPage: wrong, menu, right
			// By double tapping on the menu space, the settings appears
			document.getElementById("wrongSpace").addEventListener("click", function(){
				wrong();
			});
			document.getElementById("wrongButton").addEventListener("click", function(){
				wrong();
			});
			
			document.getElementById("menuSpace").addEventListener("click", function(){
				doubleTapHandler(showMenu);
			});
			document.getElementById("menuButton").addEventListener("click", function(){
				showMenu();
			});
			
			document.getElementById("rightSpace").addEventListener("click", function(){
				right();
			});
			document.getElementById("rightButton").addEventListener("click", function(){
				right();
			});
			
			//EventListeners for the buttons in the menu: wrong translation, I learned it!
			document.getElementById("menuLargeSpace").addEventListener("click", function(){
				var menu = document.getElementById("menuPage");
				fade(menu,5);
			});
			
			document.getElementById("wrongTranslationButton").addEventListener("click", function(){
				userData.addEvent("wrongTranslation");
				menuButton("assets/trash_icon.png");
			});
			
			document.getElementById("learnedButton").addEventListener("click", function(){
				userData.addEvent("learnedIt");
				menuButton("assets/right_icon.png");
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
				printWord();	
			});

			document.getElementById("time").addEventListener("click", function(){
				var canvas = document.getElementById("landscapeBackground");
				canvas.style.background = backgroundSource[backgroundNumber];
				canvas.style.backgroundSize = BACKGROUND_SIZE;
				if (backgroundNumber === backgroundSource.length-1){
					backgroundNumber = 0;
				} else {
					backgroundNumber++;
				}
			});
			
			document.getElementById("logOutButton").addEventListener("click", function(){
				userData.clear();
				document.location.reload(true);
			});
			
			document.getElementById("backButtonInSettings").addEventListener("click", function(){
				var settings = document.getElementById("settingsPage");
				fade(settings,5);
			});
		},
	};
});