/**
 * battery.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var BATTERY_COLOR = "green";
	var BATTERY_LOW_COLOR = "red";

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

			battery.onchargingchange = function () {
				if (battery.charging) {
					console.log("battery is charging");
				} else {
					console.log("battery is not charging");
				}
			};

			battery.onlevelchange = function () {
				console.log(Math.floor(battery.level * 100));
				document.getElementById("battery").setAttribute("d", describeArc(180, 180, 180, 270, 270+battery.level*180));
				if (battery.level > 0.15) {
					document.getElementById("battery").setAttribute("stroke", BATTERY_COLOR);
				} else {
					document.getElementById("battery").setAttribute("stroke", BATTERY_LOW_COLOR);
				}
			};
		}
	};
});