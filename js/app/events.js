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

	var SESSION_ENDPOINT = "https://zeeguu.unibe.ch/api/upload_smartwatch_events";
	
	var currentEvent;
	var events;

	return {

		save: function(eventType, id) {
			time.create();
			currentEvent = {
				"bookmark_id": id,
				"time": time.getTimestamp(),
				"event": eventType
			};
			if (localStorage.getItem("events") !== null) {
				events = JSON.parse(localStorage.getItem("events"));
				events.push(currentEvent);
				localStorage.setItem("events", JSON.stringify(events));
			} else {
				events = [];
				events.push(currentEvent);
				localStorage.setItem("events", JSON.stringify(events));
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
	};

});