/**
 * battery.js
 *
 * This module fetches the current battery level which is a number between 0 and 100. 
 * With this number an arc is drawn to inform the user about the current battery level.
 *
 * implementation based on: http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var BATTERY_COLOR = "green";
	var BATTERY_LOW_COLOR = "red";
	var BATTERY_IS_LOW = 0.15;

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle){
		var start = polarToCartesian(x, y, radius, endAngle);
		var end = polarToCartesian(x, y, radius, startAngle);
		var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

		var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");

		return d;       
	}

	return {

		draw: function () {
			var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

			battery.onlevelchange = function () {
				document.getElementById("battery").setAttribute("d", describeArc(180, 180, 180, 270, 270+battery.level*180));
				if (battery.level > BATTERY_IS_LOW) {
					document.getElementById("battery").setAttribute("stroke", BATTERY_COLOR);
				} else {
					document.getElementById("battery").setAttribute("stroke", BATTERY_LOW_COLOR);
				}
			};
		}
	};
});