/**
 * events.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

	var SESSION_ENDPOINT = "https://zeeguu.unibe.ch//upload_smartwatch_events";

	var events = [];
	var numberOfEvents = 0;

	function clear() {
		// to be implemented
	}

	return {

		add: function(event, id) {
			time.create();
			events[numberOfEvents++] = {
				"bookmark_id": id,
				"time": time.getTimestamp(),
				"event": event
			};
		},

		save: function() {
			localStorage.setItem("events", JSON.stringify(events));
			console.log("events saved: " + JSON.stringify(events));
		},

		load: function() {
			events = JSON.parse(localStorage.getItem(localStorage.key("events")));
			console.log("events loaded: " + JSON.stringify(events));
		},

		send: function(sessionNumber) {
			var data = new FormData();
			data.append('events', JSON.stringify(events));

			var xhr = new XMLHttpRequest();
			xhr.open('POST', SESSION_ENDPOINT + "?session=" + sessionNumber, false);
			xhr.onload = function () {
				if (this.responseText == "OK") {
					console.log("events are succesfully send!");
				}
			};
			xhr.send(data);
		},

		print: function() {
			console.log(JSON.stringify(events));
		}
	};

});