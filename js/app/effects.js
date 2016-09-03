/**
 * effects.js
 *
 * This module takes care of certain effects in the gui:
 * fade, unfade and feedBackByImage.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var canvas, ctx;

	//definitions image
	var IMG_WIDTH = 360;
	var IMG_HEIGHT = 120;

	//definitions for fading time in milliseconds
	var FADING_TIME = 20;

	return {

		feedbackByImage: function(imgSource) {
			canvas = document.getElementById("popupWordCanvas");
			canvas.style.visibility = "visible";
			canvas.style.opacity = 1.0;
			ctx = canvas.getContext("2d");

			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0, IMG_WIDTH, IMG_HEIGHT);
			};
			img.src = imgSource;
			
			this.fade(canvas,FADING_TIME);
		},

		fade: function(element, fadeTime) {
			var opacity = 0.9;  // initial opacity
			var timer = setInterval(function () {
			if (opacity <= 0.1){
				clearInterval(timer);
				element.style.visibility = "hidden";
			}
			element.style.opacity = opacity;
			element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
			opacity -= opacity * 0.1;
			}, fadeTime);
		},
		
		unfade: function(element, fadeTime) {
	    	var opacity = 0.1;  // initial opacity
	    	element.style.display = 'block';
	    	var timer = setInterval(function () {
	    		if (opacity >= 0.9){
	    			clearInterval(timer);
	    		}
	    		element.style.opacity = opacity;
	    		element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
	    		opacity += opacity * 0.1;
	    	}, fadeTime);
	    },
	};
});