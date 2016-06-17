/**
 * events.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time'], function(time) {

	var events = [];
	var numberOfEvents = 0;

	function clear() {
		// to be implemented
	}

	return {

		add: function(event, id) {
			time.create();
			events[numberOfEvents++] = {
				"eventType": event,
				"time": time.getTimestamp(),
				"id": id
			};
		},

		save: function() {
			// to be implemented
		},

		load: function() {
			// to be implemented
		},

		send: function() {
			// to be implemented
		},

		print: function() {
			console.log(JSON.stringify(events));
		}
	};

});