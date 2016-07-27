/**
 * clickTracker.js
 *
 * This module contains all the functions used for tracking the tap locations
 * of the user and sending them away to the server.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

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
		},

		saveClicks: function() {
			if (localStorage.getItem("clicks") !== null) {
				var storage = JSON.parse(localStorage.getItem("clicks"));
				console.log("clicks currently in local storage: " + JSON.stringify(storage));
				console.log("saving...");
				localStorage.setItem("clicks", JSON.stringify(storage.concat(clicks)));
				var test = JSON.parse(localStorage.getItem("clicks"));
				console.log("clicks saved: " + JSON.stringify(test));
			} else {
				//already something in storage
				console.log("currently no clicks in storage");
				console.log("saving...");
				localStorage.setItem("clicks", JSON.stringify(clicks));
				console.log("clicks saved: " + JSON.stringify(clicks));
			}
		},

		loadClicks: function() {
			if (localStorage.getItem("clicks") !== null) {
				clicks = JSON.parse(localStorage.getItem("clicks"));
				console.log("loaded clicks: " + JSON.stringify(clicks));
			}
		},

		sendClicks: function(sessionNumber) {
			var data = new FormData();
			console.log("trying to send click positions:" + JSON.stringify(clicks));
			data.append('time', time.getTimestamp());
			data.append('event', "clicks");
			data.append('value', "see extra data");
			data.append('extra_data', clicks);

			var xhr = new XMLHttpRequest();

			xhr.open('POST', USER_ACTIVITY_ENDPOINT + "?session=" + sessionNumber, true);
			xhr.onload = function() {
				console.log("clicks uploaded to db: " + this.responseText);
				if (this.responseText === "OK") {
					console.log("removing clicks localStorage..");
					localStorage.removeItem("clicks");
					console.log("clicks in storage: " + localStorage.getItem("clicks"));
				}
			};
			xhr.send(data);
		},
	};
});