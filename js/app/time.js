/**
 * time.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var date, year, day, month, hours, minutes, seconds;
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
	};
});