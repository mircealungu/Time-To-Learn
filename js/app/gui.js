/**
 * gui.js
 *
 * This is the module where the drawing takes place for the 
 * mainPage and the revealedPage and where the eventsListeners of these
 * pages are initialized.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['battery', 'userData', 'time', 'weather', 'fireworks', 
	'background', 'effects', 'settings', 'menu', 'profile', 'codeShow', 'context'], 
	function(battery, userData, time, weather, fireworks, 
		background, effects, settings, menu, profile, codeShow, context) {
	
	//definitions about text
	var FONT = "px Arial";
	var WORD_FONT_SIZE = 45;
	var TRANSLATION_FONT_SIZE = 35;
	var FONT_COLOR = "white";

	//definitions for coordinates
	var SCREEN_WIDTH = 360;
	
	var WORDSPACE_HEIGHT = 120;
	var WORD_POSY = 45;
	var TRANSLATION_POSY = 95;

	var RIGHT_IMG_SOURCE = "assets/right_icon_icon.png";
	var WRONG_IMG_SOURCE = "assets/wrong_icon_icon.png";

	var ctxWords;
	var doubleTapTimer = null;
	
	function printOnScreen(string, posx, posy, size) {
			ctxWords.font = size + FONT;
			ctxWords.fillStyle = FONT_COLOR;
			ctxWords.textAlign = "center";
			ctxWords.fillText(string, posx, posy);
	}

	function printWord(){
		document.getElementById("wordCanvas").style.backgroundImage = "url('assets/background.png')";

		ctxWords.clearRect(0, 0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		printOnScreen(userData.getWord(), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		
		var canvasRevealPage = document.getElementById("revealedPage");
		canvasRevealPage.style.visibility = "hidden";
	}
	
	function revealTranslation(){
		ctxWords.clearRect(0, 6, SCREEN_WIDTH, WORDSPACE_HEIGHT);
		printOnScreen(userData.getWord(), SCREEN_WIDTH/2, WORD_POSY, WORD_FONT_SIZE);
		printOnScreen(userData.getTranslation(), SCREEN_WIDTH/2, TRANSLATION_POSY, TRANSLATION_FONT_SIZE);
		
		document.getElementById("wordCanvas").style.backgroundImage = "url('assets/revealed_clicked_background.png')";
		var canvasRevealPage = document.getElementById("revealedPage");
		canvasRevealPage.style.visibility = "visible";
	}

	/* The function doubleTapHandler handles a double tap on the scrren of the watch. A page is given as
	parameter, because the double tap has a different function on different pages.*/
	function doubleTapHandler(page) {
		if (doubleTapTimer === null) {
			// handle single tap
			doubleTapTimer = setTimeout(function () {
				doubleTapTimer = null;
				background.change();
			}, 300);
		} else {
			// handle double tap
			clearTimeout(doubleTapTimer);
			doubleTapTimer = null;
			if (page === "time") {
				settings.show();				
			} else {
				codeShow.changePage();
			}
		}
	}

	function right() {
		profile.userIsActive();
		profile.save();
		userData.saveEvent("right");
		userData.sendEvents();
		var imgSource = RIGHT_IMG_SOURCE;

		userData.updateWordPair(true);
		userData.saveWordPair();
		effects.feedbackByImage(imgSource);
		printWord();	
	}

	function wrong() {
		profile.userIsActive();
		profile.save();
		userData.saveEvent("wrong");
		userData.sendEvents();
		var imgSource = WRONG_IMG_SOURCE;

		userData.updateWordPair(false);
		userData.saveWordPair();
		effects.feedbackByImage(imgSource);
		printWord();
	}

	function initListeners() {
			// EventListeners for revealing the translation (the user can click the word space or the button)
			// By double tapping on the time, the settings appears
			document.getElementById("wordCanvas").addEventListener("click", function(e){
				userData.saveEvent("reveal");
				revealTranslation();

				userData.saveClick(e.clientX, e.clientY, "reveal");
			});
			
			document.getElementById("revealButton").addEventListener("click", function(e){
				userData.saveEvent("reveal");
				revealTranslation();
				context.hide();
				if (context.isShown()) {
					context.hide();
				}
				userData.saveClick(e.clientX, e.clientY, "reveal");
			});

			document.getElementById("contextButton").addEventListener("click", function(e){
				userData.saveEvent("showContext");
				if (context.isShown()) {
					context.hide();
				} else {
					context.show();
				}
				userData.saveClick(e.clientX, e.clientY, "showContext");
			});
			
			// EventListeners for the revealedPage: wrong, menu, right
			// By double tapping on the menu space, the settings appears
			document.getElementById("wrongCanvas").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "wrong");
				wrong();	
			});
			document.getElementById("wrongButton").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "wrong");
				wrong();
			});
			document.getElementById("menuCanvas").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "menu");
				menu.show();
			});
			document.getElementById("menuButton").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "menu");
				menu.show();
			});
			
			document.getElementById("rightCanvas").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "right");
				right();
			});
			document.getElementById("rightButton").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "right");
				right();
			});
			document.getElementById("time").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "time");
				doubleTapHandler("time");
			});
			document.getElementById("codeShowPage").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "time");
				doubleTapHandler("codeShowPage");
			});
			document.getElementById("qrcodePage").addEventListener("click", function(e){
				userData.saveClick(e.clientX, e.clientY, "time");
				doubleTapHandler("codeShowPage");
			});
	}

	function update() {
		profile.refresh();
		time.refresh();
		background.rotate();
	}

	function draw() {
		time.draw();
		time.drawDate();
		battery.draw();
		weather.draw();
	}

	return {

		render: function() {
			update();
			draw();
		},

		create: function(ctx) {
			ctxWords = ctx;

			profile.create();
			time.create();
			settings.create(printWord);
			menu.create(printWord, revealTranslation);
			background.create();
			context.create();
			
			weather.create();
			weather.refresh();

			// print first word
			printWord();
			initListeners();
		},
	};
});