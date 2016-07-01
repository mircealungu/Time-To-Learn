/**
 * time.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var date, year, day, month, hours, minutes, seconds;
	var sunrise = 5 * 60 + 7 * 1;
	var sunset = 22 * 60 + 3 * 1;
	var timer = 0;
	var test = 5;

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

	return {

		create: function() {
			date = getTizenDateTime();
			year = date.getFullYear();
			day = checkNumberOfDigits(date.getDate());
			month = checkNumberOfDigits(date.getMonth() + 1);
			hours = checkNumberOfDigits(date.getHours());
			minutes = checkNumberOfDigits(date.getMinutes());
			seconds = checkNumberOfDigits(date.getSeconds());
			
			// create is called every second in gui.js, so timer is in seconds
			timer++;
		},

		getTimestamp: function() {
			return year+"-"+month+"-"+day+"T"+hours+":"+minutes+":"+seconds;
		},

		getDay: function() {
			return day;
		},

		getHours: function() {
			return hours;
		},

		getMinutes: function() {
			return minutes;
		},

		getTimer: function() {
			return timer;
		},
		
		getSunrise: function() {
			return sunrise;
		},
		
		getSunset: function() {
			return sunset;
		},

		resetTimer: function() {
			timer = 0;
		},

		setTest: function() {
			test = 0;
		}
	};
});