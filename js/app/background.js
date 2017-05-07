/**
 * background.js
 *
 * This module has all the functions for designing and updating the background behind the time. 
 * The background consists of a rotating image with the sun and the moon and a 
 * landscape on top of the rotating image, which can be changed by tapping on the time.
 * 
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData'], function(userData) {

	var canvas;
	var degrees;

	var backgroundSource = ["url('assets/simple_background.png')", 
	                        "url('assets/city_background.png')", 
	                        "url('assets/countryside_background.png')"];

	//definitions
	var MINUTES_IN_ONE_DAY = 1440;
	var BACKGROUND_SIZE = "360px 180px";

	return {

		create: function() {
			canvas = document.getElementById("landscapeCanvas");
			if (localStorage.getItem("backgroundNumber") === null) {
				userData.setBackgroundNumber(0);
			} 
			canvas.style.background = backgroundSource[userData.getBackgroundNumber()];
			canvas.style.backgroundSize = BACKGROUND_SIZE;
		},

		change: function() {
			userData.increaseBackgroundNumber();
			if (userData.getBackgroundNumber() === backgroundSource.length){
				userData.setBackgroundNumber(0);
			} 
			canvas.style.background = backgroundSource[userData.getBackgroundNumber()];
			canvas.style.backgroundSize = BACKGROUND_SIZE;
		},

		rotate: function(sunrise, sunset, minutes) {
			if(minutes >= sunrise && minutes <= sunset) {
				// day
				degrees = (180 / (sunset - sunrise)).toFixed(2);
				degrees = 90 + (minutes - sunrise) * degrees;
				document.getElementById("rotationCanvas").style.transform = "rotate(" + degrees + "deg)";
			} else {
				// night
				degrees = (180 / (sunrise + (MINUTES_IN_ONE_DAY - sunset))).toFixed(2);
				if(minutes > sunset) {
					degrees = 270 + (minutes - sunset) * degrees;
				} else {
					degrees = 270 + (minutes + (MINUTES_IN_ONE_DAY - sunset)) * degrees;
				}
				document.getElementById("rotationCanvas").style.transform = "rotate(" + degrees + "deg)";
			}

		}
	};
});