/**
 * background.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var backgroundNumber = 0;
	var backgroundSource = ["url('assets/simple_background.png')", 
	                        "url('assets/city_background.png')", 
	                        "url('assets/countryside_background.png')"];

	//definitions
	var MINUTES_IN_ONE_DAY = 1440;
	var BACKGROUND_SIZE = "360px 180px";

	return {

		change: function() {
			backgroundNumber++;
			if (backgroundNumber === backgroundSource.length){
				backgroundNumber = 0;
			} 

			var canvas = document.getElementById("landscapeCanvas");
			canvas.style.background = backgroundSource[backgroundNumber];
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