/**
 * popup.js
 *
 * The module is used in login.js for drawing popups in login when there is 
 * no connection, wrong password or in case the user has too few words in 
 * his account.
 *
 * This module is also used for drawing medals in the gui.js to inform the user
 * about a certain achievement.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['fireworks', 'effects'], function(fireworks, effects) {

	var popupMedal;
	var ctxLogin, ctxMedal;

	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;

	var POPUP_TEXT_HEIGHT_1 = 110;
	var POPUP_TEXT_HEIGHT_2 = 155;
	var POPUP_TEXT_HEIGHT_3 = 185;
	var POPUP_TEXT_HEIGHT_4 = 215;
	var POPUP_TEXT_HEIGHT_5 = 245;
	var POPUP_TEXT_HEIGHT_6 = 290;

	// login popup font
	var LOGIN_POPUP_FONT = "30px Arial";
	var LOGIN_POPUP_FONT_COLOR = "white";
	var LOGIN_POPUP_FONT_FOOTER = "15px Arial";

	// medal popup 
	var MEDAL_POPUP_TITLE_POSY = 245;
	var MEDAL_POPUP_TEXT_POSY_1 = 272;
	var MEDAL_POPUP_TEXT_POSY_2 = 293;

	// medal font
	var MEDAL_POPUP_TITLE_FONT = "40px Arial";
	var MEDAL_POPUP_TEXT_FONT = "20px Arial";
	var MEDAL_POPUP_FONT_COLOR = "white";

	var FADING_TIME = 5;

	function messageInit() {
		ctxMedal.fillStyle = MEDAL_POPUP_FONT_COLOR;
		ctxMedal.textAlign = "center";
	}

	function popupShow() {
		popupMedal.style.visibility = "visible";
		popupMedal.style.opacity = "1.0";
		
		ctxMedal.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		fireworks.start();

		ctxMedal.font = MEDAL_POPUP_TITLE_FONT;
		ctxMedal.fillText("Great job!", SCREEN_WIDTH / 2, MEDAL_POPUP_TITLE_POSY);
		// change font to message font
		ctxMedal.font = MEDAL_POPUP_TEXT_FONT;
	}

	function drawMedal(category) {
		var img = new Image();
		img.onload = function() {
			ctxMedal.drawImage(img, 80,10, 200, 200);
		};
		img.src = "assets/medal_" + category + ".png";
	}

	return {

		medalInitialization: function() {
			popupMedal = document.getElementById("popup");
			ctxMedal = document.getElementById("popupCanvas").getContext("2d");
			
			messageInit();
			
			document.getElementById("okayButtonInPopup").addEventListener("click", function(){
				fireworks.stop();
				effects.fade(popupMedal, FADING_TIME);
			});
		},

		forLogin: function(version, resetCode) {
			document.getElementById("loginPopup").style.visibility = "visible";
			ctxLogin = document.getElementById("loginPopupCanvas").getContext("2d");
			ctxLogin.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

			ctxLogin.font = LOGIN_POPUP_FONT;
			ctxLogin.fillStyle = LOGIN_POPUP_FONT_COLOR;
			ctxLogin.textAlign = "center";

			if (version === "NO_CONNECTION") {
				ctxLogin.fillText("NO CONNECTION", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_1);
				ctxLogin.fillText("There isn't a connection", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_2);
				ctxLogin.fillText("with the internet.", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_3);
				ctxLogin.fillText("Please check your", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_4);
				ctxLogin.fillText("internet connection.", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_5);
			} else if (version === "WRONG_SESSION_NUMBER") {
				ctxLogin.fillText("WRONG PASSWORD", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_1);
				ctxLogin.fillText("This password is not", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_2);
				ctxLogin.fillText("recognized in our database.", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_3);
				ctxLogin.fillText("Please check your account", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_4);
				ctxLogin.fillText("at Zeeguu.", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_5);
			} else {
				ctxLogin.fillText("TOO FEW WORDS", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_1);
				ctxLogin.fillText("More words needed,", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_2);
				ctxLogin.fillText("please make sure you have", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_3);
				ctxLogin.fillText("at least 5 words.", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_4);
			}

			ctxLogin.font = LOGIN_POPUP_FONT_FOOTER;
			ctxLogin.fillStyle = LOGIN_POPUP_FONT_COLOR;
			ctxLogin.textAlign = "center";
			ctxLogin.fillText("please press the screen to try again", SCREEN_WIDTH/2, POPUP_TEXT_HEIGHT_6);

			resetCode(1);

			document.getElementById("loginPopupCanvas").addEventListener("click", function(){
				document.getElementById("loginPopup").style.visibility = "hidden";
			});
		},

		forWordsLearned: function(wordsLearned) {
			popupShow();
			drawMedal("words_learned");
			if (wordsLearned === 1) {
				ctxMedal.fillText("You just learned", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_1);
				ctxMedal.fillText("your first word!", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_2);
			} else {
				ctxMedal.fillText("You have already learned", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_1);
				ctxMedal.fillText(wordsLearned + " words", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_2);
			}
		},

		forTotalTime: function(time) {
			popupShow();
			drawMedal("total_time");
			ctxMedal.fillText("You have already used the app", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_1);
			ctxMedal.fillText("for " + time, SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_2);
		},

		forSessionTime: function() {
			popupShow();
			drawMedal("longest_session");
			ctxMedal.fillText("You are currently in", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_1);
			ctxMedal.fillText("your longest session", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_2);
		},

		forLearningStreak: function(days) {
			popupShow();
			drawMedal("longest_streak");
			ctxMedal.fillText("You have learned for", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_1);
			ctxMedal.fillText(days + " days in a row", SCREEN_WIDTH / 2, MEDAL_POPUP_TEXT_POSY_2);
		}
	};
});