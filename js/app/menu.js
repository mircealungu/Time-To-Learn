/**
 * menu.js
 *
 * This module implements the menu interface for the words. This menu will be shown
 * if you press the more button in the middle of the screen. The user can press
 * 'wrong translation', 'I learned it! don't show it again' or 'show context'.
 * The menu will fade away in 5s if the user does not do anything.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['effects', 'userData', 'profile', 'context'], function(effects, userData, profile, context) {

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

	var WORDSPACE_HEIGHT = 120;

	var LEARNED_IMG_SOURCE = "assets/right_icon_icon.png";
	var TRASH_IMG_SOURCE = "assets/trash_icon.png";

	var TEXT_FONT = "20px Arial";
	var TEXT_COLOR = "white";

	function fade() {
		effects.fade(menu, FADING_TIME);
	}

	function menuButton(imgSource, printWord) {
		if (userData.removeWord()) {
			effects.feedbackByImage(imgSource);
			userData.saveWordPair();
			userData.sendEvents();
			printWord();
		} else {
			canvas.style.visibility = "visible";
			canvas.style.opacity = 1.0;
	
			ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);
			ctx.fillText("TOO FEW WORDS", SCREEN_WIDTH / 2, POPUP_TEXT_LINE1);
			ctx.fillText("there are too", SCREEN_WIDTH / 2, POPUP_TEXT_LINE2);
			ctx.fillText("few words left to", SCREEN_WIDTH / 2, POPUP_TEXT_LINE3);
			ctx.fillText("use this option", SCREEN_WIDTH / 2, POPUP_TEXT_LINE4);
			
			setTimeout(function(){effects.fade(canvas, FADING_TIME);}, WAITING_TIME_FOR_POPUP_TO_DISAPPEAR);
		}
	}

	function initListeners(printWord) {
			document.getElementById("menuSpace").addEventListener("click", function(){
				fade();
			});
			document.getElementById("wrongTranslationButton").addEventListener("click", function(){
				userData.saveEvent("wrongTranslation");
				menuButton(TRASH_IMG_SOURCE, printWord);
			});
			document.getElementById("learnedButton").addEventListener("click", function(){
				profile.increaseWordsLearned();
				profile.userIsActive();
				profile.save();
				userData.saveEvent("learnedIt");
				menuButton(LEARNED_IMG_SOURCE, printWord);
			});
			document.getElementById("contextInMenuButton").addEventListener("click", function(){
				userData.saveEvent("showContext");
				context.show();
			});
			document.getElementById("backButtonInMenu").addEventListener("click", function(){
				fade();
			});
	}

	return {

		create: function(printWord) {
			menu = document.getElementById("menuPage");
			canvas = document.getElementById("popupWordCanvas");
			ctx = canvas.getContext("2d");

			ctx.font = TEXT_FONT;
			ctx.fillStyle = TEXT_COLOR;
			ctx.textAlign = "center";

			initListeners(printWord);
		},

		show: function() {
			menu.style.visibility = "visible";
			effects.unfade(menu, FADING_TIME);
		}
	};
});