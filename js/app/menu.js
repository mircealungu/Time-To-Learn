/**
 * menu.js
 *
 * This module implements the menu interface for the words. This menu will be shown
 * if you press the more button in the middle of the screen. The user can press
 * 'wrong translation', 'I learned it! don't show it again' or 'show context'.
 * The menu will fade away in 5s if the user does not do anything.
 *
 * made by Rick Nienhuis & Niels Haan
 * 
 * NEW FEATURES:
 * 
 * When pressing the 'show context' button, the new window appears 
 * with proposed sentence. After you click anywhere on the screen it 
 * returns to the main page.
 * 
 * made by Yaroslav Tykhonchuk
 */

define(['effects', 'userData', 'profile', 'context'], function(effects, userData, profile, context) {

	var menu,contextPage;
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

	var WORDSPACE_HEIGHT = 300;

	var LEARNED_IMG_SOURCE = "assets/right_icon_icon.png";
	var TRASH_IMG_SOURCE = "assets/trash_icon.png";

	var TEXT_FONT = "25px Arial";
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
			document.getElementById("popupWordCanvas").addEventListener("click", function(){
				console.log("popupWordsCanvas");
				effects.fade(canvas, FADING_TIME);
			});
			document.getElementById("showContextPage").addEventListener("click", function(){
				console.log("context fade");
				effects.fade(contextPage, FADING_TIME);
				effects.fade(canvas, FADING_TIME);
			});
	}

	return {

		create: function(printWord) {
			menu = document.getElementById("menuPage");
			contextPage = document.getElementById("showContextPage");
			canvas = document.getElementById("contextCanvas");
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