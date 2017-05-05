/**
 * context.js
 *
 * This module is used for showing the context of the word.
 * 
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData', 'effects'], function(userData, effects) {

	var canvas, ctx;
	var isShown = false;

	var FIRST_SENTENCE_HEIGHT =25;
	var SECOND_SENTENCE_HEIGHT = 50;
	var THIRD_SENTENCE_HEIGHT = 75;
	var FOURTH_SENTENCE_HEIGHT = 100;

	var WORDSPACE_HEIGHT = 120;
	var SCREEN_WIDTH = 360;

	var TEXT_FONT = "20px Arial";
	var TEXT_COLOR = "white";

	var FADING_TIME = 5;

	function initListener() {
		document.getElementById("popupWordCanvas").addEventListener("click", function(){
			effects.fade(canvas, FADING_TIME);
		});
	}

	return {

		create: function() {
			canvas = document.getElementById("popupWordCanvas");
			ctx = canvas.getContext("2d");

			ctx.font = TEXT_FONT;
			ctx.fillStyle = TEXT_COLOR;
			ctx.textAlign = "center";

			initListener();
		},

		show: function() {
			var firstSentence = [], secondSentence = [], thirdSentence = [], fourthSentence = [];
			var context = userData.getWordPair(0).context;
			var wordsInContext = context.split(" ");
			var currentSentence = 1;

			for(var i=0; i<wordsInContext.length; i++) {
				if(currentSentence === 1 && ctx.measureText(firstSentence + " " + wordsInContext[i]).width < 350) {
					firstSentence += " " + wordsInContext[i];
					continue;
				} else if(currentSentence <= 2 && ctx.measureText(secondSentence + " " + wordsInContext[i]).width < 340) {
					currentSentence = 2;
					secondSentence += " " + wordsInContext[i];
					continue;
				} else if(currentSentence <= 3 && ctx.measureText(thirdSentence + " " + wordsInContext[i]).width < 320) {
					currentSentence = 3;
					thirdSentence += " " + wordsInContext[i];
					continue;
				} else {
					currentSentence = 4;
					fourthSentence += " " + wordsInContext[i];
				}
			}

			canvas.style.visibility = "visible";
			canvas.style.opacity = 1.0;
			
			ctx.clearRect(0, 0, SCREEN_WIDTH, WORDSPACE_HEIGHT);
			ctx.fillText(firstSentence, SCREEN_WIDTH/2, FIRST_SENTENCE_HEIGHT);
			ctx.fillText(secondSentence, SCREEN_WIDTH/2, SECOND_SENTENCE_HEIGHT);
			ctx.fillText(thirdSentence, SCREEN_WIDTH/2, THIRD_SENTENCE_HEIGHT);
			ctx.fillText(fourthSentence, SCREEN_WIDTH/2, FOURTH_SENTENCE_HEIGHT);

			isShown = true;
		},

		hide: function() {
			effects.fade(canvas, FADING_TIME);
			isShown = false;
		},

		isShown: function() {
			return isShown;
		}
	};
});