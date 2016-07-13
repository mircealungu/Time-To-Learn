/**
 * menu.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['effects', 'userData'], function(effects, userData) {

	var menu;
	var canvas, ctx;

	//definitions
	var FADING_TIME = 5;

	var POPUP_TEXT_LINE1 = 25;
	var POPUP_TEXT_LINE2 = 50;
	var POPUP_TEXT_LINE3 = 70;
	var POPUP_TEXT_LINE4 = 90;
	var WAITING_TIME_FOR_POPUP_TO_DISAPPEAR = 3000;

	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;

	function fade() {
		effects.fade(menu, FADING_TIME);
	}

	function menuButton(imgSource, printWord) {
		if (userData.removeWord()) {
			effects.feedbackByImage(imgSource);
			userData.saveEvents();
			userData.saveWordPair();
			userData.sendEvents();
			printWord();
		} else {
			canvas.style.visibility = "visible";
			canvas.style.opacity = 0.8;
	
			ctx.clearRect(0,0,SCREEN_WIDTH, SCREEN_HEIGHT / 2);
			
			ctx.font = "20px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			
			ctx.fillText("TOO FEW WORDS", SCREEN_WIDTH / 2, POPUP_TEXT_LINE1);
			ctx.fillText("there are too", SCREEN_WIDTH / 2, POPUP_TEXT_LINE2);
			ctx.fillText("few words left to", SCREEN_WIDTH / 2, POPUP_TEXT_LINE3);
			ctx.fillText("use this option", SCREEN_WIDTH / 2, POPUP_TEXT_LINE4);
			
			setTimeout(function(){effects.fade(canvas, FADING_TIME);}, WAITING_TIME_FOR_POPUP_TO_DISAPPEAR);
		}
	}

	return {

		create: function(printWord) {
			menu = document.getElementById("menuPage");
			canvas = document.getElementById("imageFadeCanvas");
			ctx = canvas.getContext("2d");

			document.getElementById("menuSpace").addEventListener("click", function(){
				fade();
			});
			
			document.getElementById("wrongTranslationButton").addEventListener("click", function(){
				userData.addEvent("wrongTranslation");
				//userData.deleteFromServer();
				menuButton("assets/trash_icon.png", printWord);
			});
			
			document.getElementById("learnedButton").addEventListener("click", function(){
				userData.addEvent("learnedIt");
				menuButton("assets/right_icon.png", printWord);
			});
			
			document.getElementById("backButtonInMenu").addEventListener("click", function(){
				fade();
			});
		},

		show: function() {
			menu.style.visibility = "visible";
			effects.unfade(menu, FADING_TIME);
			setTimeout(function(){fade();}, 5000);
		}
	};
});