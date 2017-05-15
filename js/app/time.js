/**
 * time.js
 *
 * This module takes of drawing the digital time and the date on the screen.
 * Also time usage tracking happens in this module, timers for totalTime and sessionTime
 * are used in profile.js
 * Finally this module will also provide timeStamps for the events.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var ctxTime, ctxDate;

	var date, year, day, month, hours, minutes, seconds;
	var totalTime = 0;
	var sessionTime = 0;
	var pause = false;

	//definitions
	var DATE_WIDTH = 100;
	var DATE_HEIGHT = 90;
	var DATE_COLOR = "white";
	var DATE_POSX = 72;
	var DATE_POSY = 63;

	var TIME_HEIGHT = 180;
	var TIME_WIDTH = 360;
	var TIME_POSY = 160;
	var TIME_FONT = "120px Arial";
	var TIME_COLOR = "white";

	function getTizenDateTime() {
		var date;
		try {
			date = tizen.time.getCurrentDateTime();
		} catch (err) {
			console.error('Error: ', err.message);
		}
		return date;
	}

	function checkNumberOfDigits(value) {
		if (value < 10) {
			value = "0" + value;
		}
		return value;
	}

	function refreshTime() {
		date = getTizenDateTime();
		year = date.getFullYear();
		day = checkNumberOfDigits(date.getDate());
		month = checkNumberOfDigits(date.getMonth() + 1);
		hours = checkNumberOfDigits(date.getHours());
		minutes = checkNumberOfDigits(date.getMinutes());
		seconds = checkNumberOfDigits(date.getSeconds());
	}

	return {

		create: function() {
			ctxTime = document.getElementById("timeCanvas").getContext("2d");
			ctxDate = document.getElementById("iconCanvas").getContext("2d");
		},

		refresh: function() {
			refreshTime();
			
			if (!pause) {
				totalTime++;
				sessionTime++;
			}
		},
		
		getTotalTime: function () {
			return totalTime;
		},

		setTotalTime: function(total_time) {
			totalTime = total_time;
		},

		getSessionTime: function() {
			return sessionTime;
		},

		resetSessionTime: function() {
			sessionTime = 0;
		},
		
		pauseUsageTracking: function () {
			pause = true;
		},
		
		startUsageTracking: function () {
			pause = false;
		},

		getTimestamp: function() {
			refreshTime();
			return year+"-"+month+"-"+day+"T"+hours+":"+minutes+":"+seconds;
		},

		getHours: function() {
			return hours;
		},

		getMinutes: function() {
			return minutes;
		},

		drawDate: function() {
			ctxDate.clearRect(0, 0, DATE_WIDTH,DATE_HEIGHT);
			ctxDate.font = "30px Arial";
			ctxDate.fillStyle = DATE_COLOR;
			ctxDate.textAlign = "center";
			ctxDate.fillText(day, DATE_POSX, DATE_POSY);
		},

		draw: function() {
			ctxTime.clearRect(0, 0, TIME_WIDTH, TIME_HEIGHT);
			ctxTime.font = TIME_FONT;
			ctxTime.fillStyle = TIME_COLOR;
			ctxTime.textAlign = "center";
			ctxTime.fillText(hours + ":" + minutes, TIME_WIDTH/2, TIME_POSY);
		}
	};
});