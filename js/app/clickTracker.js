/**
 * clickTracker.js
 *
 * This module contains all the functions used for tracking the tap locations
 * of the user.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var clicks = [];
	var numberOfClicks = 0;
	var ctx, clickTracker;
	var onMainpage = false;

	var POPUP_WIDTH = 360;
	var POPUP_HEIGHT = 360;

	// circle definitions
	var RADIUS = 6;
	var STARTING_POINT = 0;
	var END_POINT = 2*Math.PI;

	function init() {
		clickTracker = document.getElementById("clickTracker");
		clickTracker.style.visibility = "visible";
		ctx = document.getElementById("clickTrackerCanvas").getContext("2d");
		ctx.clearRect(0, 0, POPUP_WIDTH, POPUP_HEIGHT);

		if (document.getElementById("revealedPage").style.visibility === "hidden") {
			onMainpage = true;
		} else {
			onMainpage = false;
		}

		document.getElementById("clickTrackerCanvas").addEventListener("click", function(){
			clickTracker.style.visibility = "hidden";
		});
	}

	function drawClick(color, pos_x, pos_y, on_main_page) {
		if (on_main_page) {
			ctx.beginPath();
			ctx.arc(pos_x, pos_y, RADIUS, STARTING_POINT, END_POINT);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.stroke();
		}
	}

	return {

		addClick: function(pos_x, pos_y, click_type) {
			clicks[numberOfClicks++] = {
				"posX": pos_x,
				"posY": pos_y,
				"type": click_type,
			};
		},

		showPositions: function() {
			init();
			for (var i=0; i<clicks.length; i++) {
				switch (clicks[i].type) {
					case "reveal":
						drawClick("yellow", clicks[i].posX, clicks[i].posY, onMainpage);
						break;
					case "time":
						drawClick("white", clicks[i].posX, clicks[i].posY, true);
						break;
					case "settings":
						drawClick("blue", clicks[i].posX, clicks[i].posY, true);
						break;
					case "wrong":
						drawClick("red", clicks[i].posX, clicks[i].posY, !onMainpage);
						break;
					case "menu":
						drawClick("orange", clicks[i].posX, clicks[i].posY, !onMainpage);
						break;
					case "right":
						drawClick("green", clicks[i].posX, clicks[i].posY, !onMainpage);
						break;
				}
			}
		}
	};
});