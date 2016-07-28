/**
 * events.js
 *
 * This module takes care of adding, saving, loading and sending events.
 * The events are saved in the localStorage and once there is a connection
 * they will be send to the server and deleted from the localStorage.
 * The events will be used for the knowledge estimator on the server 
 * and for the user statistics.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

	var SESSION_ENDPOINT = "https://zeeguu.unibe.ch/upload_smartwatch_events";

	var events = [];
	var numberOfEvents = 0;

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
			if (localStorage.getItem("events") !== null) {
				var storage = JSON.parse(localStorage.getItem("events"));
				localStorage.setItem("events", JSON.stringify(storage.concat(events)));
			} else {
				//already something in storage
				localStorage.setItem("events", JSON.stringify(events));
			}
		},

		load: function() {
			if (localStorage.getItem("events") !== null) {
				events = JSON.parse(localStorage.getItem("events"));
			}
		},

		send: function(sessionNumber) {
			var data = new FormData();
			data.append('events', localStorage.getItem("events"));

			var xhr = new XMLHttpRequest();

			xhr.open('POST', SESSION_ENDPOINT + "?session=" + sessionNumber, true);
			xhr.onload = function() {
				if (this.responseText === "OK") {
					localStorage.removeItem("events");
				}
			};
			xhr.send(data);
		},

		clear: function() {
			events = [];
			numberOfEvents = 0;
		},
	};

});