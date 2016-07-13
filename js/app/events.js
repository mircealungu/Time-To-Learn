/**
 * events.js
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
				console.log("currently in local storage: " + JSON.stringify(storage));
				console.log("saving...");
				localStorage.setItem("events", JSON.stringify(storage.concat(events)));
				var test = JSON.parse(localStorage.getItem("events"));
				console.log("events saved: " + JSON.stringify(test));
			} else {
				//already something in storage
				console.log("currently no events in storage");
				console.log("saving...");
				localStorage.setItem("events", JSON.stringify(events));
				console.log("events saved: " + JSON.stringify(events));
			}
		},

		load: function() {
			if (localStorage.getItem("events") !== null) {
				events = JSON.parse(localStorage.getItem("events"));
				console.log("loaded events: " + JSON.stringify(events));
			}
		},

		send: function(sessionNumber) {
			var data = new FormData();
			var test = JSON.parse(localStorage.getItem("events"));
			console.log("trying to send these events:" + JSON.stringify(test));
			data.append('events', JSON.stringify(test));

			var xhr = new XMLHttpRequest();

			xhr.open('POST', SESSION_ENDPOINT + "?session=" + sessionNumber, true);
			xhr.onload = function() {
				console.log("events uploaded to db: " + this.responseText);
				if (this.responseText === "OK") {
					console.log("removing events localStorage..");
					localStorage.removeItem("events");
					console.log("events in storage: " + localStorage.getItem("events"));
				}
			};
			xhr.send(data);
		},

		print: function() {
			console.log(JSON.stringify(events));
		},

		clear: function() {
			events = [];
			numberOfEvents = 0;
		},
	};

});