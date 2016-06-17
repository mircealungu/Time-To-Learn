/**
 * time.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var date, year, day, month, hours, minutes, seconds;

	function getTizenDateTime() {
		var date;
		try {
			date = tizen.time.getCurrentDateTime();
		} catch (err) {
			console.error('Error: ', err.message);
		}
		return date;
	}

	return {

		create: function() {
			date = getTizenDateTime();
			year = date.getFullYear();
			day = date.getDate();
			month = date.getMonth() + 1;
			hours = date.getHours();
			minutes = date.getMinutes();
			seconds = date.getSeconds();

			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			if(hours<10) {
				hours = "0" + hours;
			}
			if(minutes<10){
				minutes = "0" + minutes;
			}
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
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
		}
	};
});