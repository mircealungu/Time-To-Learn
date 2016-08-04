/**
 * clickTracker.js
 *
 * This module contains all the functions used for tracking the tap locations
 * of the user and sending them away to the server.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

	var currentClick, clicks;
	var ctx, clickTracker;
	var onMainpage = false;

	var POPUP_WIDTH = 360;
	var POPUP_HEIGHT = 360;

	// circle definitions
	var RADIUS = 6;
	var STARTING_POINT = 0;
	var END_POINT = 2*Math.PI;

	var USER_ACTIVITY_ENDPOINT = "https://zeeguu.unibe.ch/upload_user_activity_data";

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
		},

		saveClick: function(pos_x, pos_y, click_type) {
			currentClick = {
				"posX": pos_x,
				"posY": pos_y,
				"type": click_type,
			};
			if (localStorage.getItem("clicks") !== null) {
				clicks = JSON.parse(localStorage.getItem("clicks"));
				clicks.push(currentClick);
				localStorage.setItem("clicks", JSON.stringify(clicks));
			} else {
				clicks = [];
				clicks.push(currentClick);
				localStorage.setItem("clicks", JSON.stringify(clicks));
			}
		},

		sendClicks: function(sessionNumber) {
			var data = new FormData();
			data.append('time', time.getTimestamp());
			data.append('event', "clicks");
			data.append('value', "see extra data");
			data.append('extra_data', clicks);

			var xhr = new XMLHttpRequest();

			xhr.open('POST', USER_ACTIVITY_ENDPOINT + "?session=" + sessionNumber, true);
			xhr.onload = function() {
				if (this.responseText === "OK") {
					localStorage.removeItem("clicks");
				}
			};
			xhr.send(data);
		},
	};
});