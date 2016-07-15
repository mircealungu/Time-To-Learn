/**
 * clickTracker.js
 *
 * This is used for tracking the places on screen where the user taps... 
 * 
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var clicks = [];
	var numberOfClicks = 0;
	var ctx, popup;
	var onMainpage = false;

	// circle definitions
	var RADIUS = 6;
	var STARTING_POINT = 0;
	var END_POINT = 2*Math.PI;

	function init() {
		popup = document.getElementById("popup");
		popup.style.visibility = "visible";
		ctx = document.getElementById("popupCanvas").getContext("2d");
		ctx.clearRect(0,0,360,360);

		if (document.getElementById("revealedPage").style.visibility === "hidden") {
			onMainpage = true;
		} else {
			onMainpage = false;
		}

		document.getElementById("popupCanvas").addEventListener("click", function(){
			popup.style.visibility = "hidden";
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