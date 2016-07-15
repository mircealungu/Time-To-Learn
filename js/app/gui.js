/**
 * gui.js
 * 
 * made by Rick Nienhuis & Niels Haan
 */

define(
		[ 'battery', 'userData', 'time', 'weather', 'fireworks',
				'clickTracker', 'background', 'effects', 'settings', 'menu' ],
		function(battery, userData, time, weather, fireworks, clickTracker,
				background, effects, settings, menu) {

			// definitions about text
			var FONT = "px Arial";
			var WORD_FONT_SIZE = 45;
			var TRANSLATION_FONT_SIZE = 35;
			var FONT_COLOR = "white";

			// definitions for coordinates
			var SCREEN_WIDTH = 360;
			var SCREEN_HEIGHT = 360;

			var WORDSPACE_HEIGHT = 120;
			var WORD_POSY = 45;
			var TRANSLATION_POSY = 95;

			var ctxWords;
			var doubleTapTimer = null;

			function printOnScreen(string, posx, posy, size) {
				ctxWords.font = size + FONT;
				ctxWords.fillStyle = FONT_COLOR;
				ctxWords.textAlign = "center";
				ctxWords.fillText(string, posx, posy);
			}

			function displayWord() {
				document.getElementById("wordCanvas").style.backgroundImage = "url('assets/background.png')";

				ctxWords.clearRect(0, 6, SCREEN_WIDTH, WORDSPACE_HEIGHT);
				printOnScreen(userData.getWord(), SCREEN_WIDTH / 2, WORD_POSY,
						WORD_FONT_SIZE);

				var canvasRevealPage = document.getElementById("revealedPage");
				canvasRevealPage.style.visibility = "hidden";
			}

			function revealTranslation() {
				ctxWords.clearRect(0, 6, SCREEN_WIDTH, WORDSPACE_HEIGHT);
				printOnScreen(userData.getWord(), SCREEN_WIDTH / 2, WORD_POSY,
						WORD_FONT_SIZE);
				printOnScreen(userData.getTranslation(), SCREEN_WIDTH / 2,
						TRANSLATION_POSY, TRANSLATION_FONT_SIZE);

				document.getElementById("wordCanvas").style.backgroundImage = "url('assets/revealed_clicked_background.png')";
				var canvasRevealPage = document.getElementById("revealedPage");
				canvasRevealPage.style.visibility = "visible";
			}

			function doubleTapHandler() {
				if (doubleTapTimer === null) {
					// handle single tap
					doubleTapTimer = setTimeout(function() {
						doubleTapTimer = null;
						background.change();
					}, 300);
				} else {
					// handle double tap
					clearTimeout(doubleTapTimer);
					doubleTapTimer = null;
					settings.show();
				}
			}

			function right() {
				userData.addEvent("right");
				userData.saveEvents();
				userData.sendEvents();
				var imgSource = "assets/right_icon.png";

				userData.updateWordPair(true);
				userData.saveWordPair();
				effects.feedbackByImage(imgSource);
				displayWord();
			}

			function wrong() {
				userData.addEvent("wrong");
				userData.saveEvents();
				userData.sendEvents();
				var imgSource = "assets/wrong_icon.png";

				userData.updateWordPair(false);
				userData.saveWordPair();
				effects.feedbackByImage(imgSource);
				displayWord();
			}

			return {

				draw : function() {
					time.refresh();
					time.draw();
					time.drawDate();
					battery.draw();
					weather.draw();

					var totalMinutes = time.getHours() * 60 + time.getMinutes()
							* 1;
					background.rotate(weather.getSunrise(),
							weather.getSunset(), totalMinutes);
				},

				create : function(ctx) {
					ctxWords = ctx;

					// create is initializing the corresponding objects..
					time.create();
					settings.create(displayWord);
					menu.create(displayWord);

					weather.create();
					weather.refresh();

					// print first word
					displayWord();

//					TODO: Extract all these in an initializeListeners() function 
					
					// EventListeners for revealing the translation (the user
					// can click the word space or the button)
					// By double tapping on the time, the settings appears
					document.getElementById("wordCanvas").addEventListener(
							"click",
							function(e) {
								userData.addEvent("reveal");
								userData.saveEvents();
								revealTranslation();

								clickTracker.addClick(e.clientX, e.clientY,
										"reveal");
							});

					document.getElementById("revealButton").addEventListener(
							"click",
							function(e) {
								userData.addEvent("reveal");
								userData.saveEvents();
								revealTranslation();
								clickTracker.addClick(e.clientX, e.clientY,
										"reveal");
							});

					// EventListeners for the revealedPage: wrong, menu, right
					// By double tapping on the menu space, the settings appears
					document.getElementById("wrongCanvas").addEventListener(
							"click",
							function(e) {
								wrong();
								clickTracker.addClick(e.clientX, e.clientY,
										"wrong");
							});
					document.getElementById("wrongButton").addEventListener(
							"click",
							function(e) {
								wrong();
								clickTracker.addClick(e.clientX, e.clientY,
										"wrong");
							});

					document.getElementById("menuCanvas").addEventListener(
							"click",
							function(e) {
								menu.show();
								clickTracker.addClick(e.clientX, e.clientY,
										"menu");
							});

					document.getElementById("menuButton").addEventListener(
							"click",
							function(e) {
								menu.show();
								clickTracker.addClick(e.clientX, e.clientY,
										"menu");
							});

					document.getElementById("rightCanvas").addEventListener(
							"click",
							function(e) {
								right();
								clickTracker.addClick(e.clientX, e.clientY,
										"right");
							});
					document.getElementById("rightButton").addEventListener(
							"click",
							function(e) {
								right();
								clickTracker.addClick(e.clientX, e.clientY,
										"right");
							});
					document.getElementById("time").addEventListener(
							"click",
							function(e) {
								clickTracker.addClick(e.clientX, e.clientY,
										"time");
								doubleTapHandler();
							});
					document.getElementById("temperatureCanvas")
							.addEventListener("click", function() {
								clickTracker.showPositions();
							});
				},
			};
		});