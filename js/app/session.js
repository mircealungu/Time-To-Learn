/**
 * session.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData'], function(userData) {

	var ctxWords;

	var SCREEN_WIDTH = 360;

	var SESSION_ENDPOINT = 'https://zeeguu.unibe.ch/';
	var BOOKMARK_SESSION = 'bookmarks_to_study/';
	var USERNAME = 'session/i@mir.lu';
	var AFTER_DATE = '2016-05-05T00:00:00';

	function length(obj) {
		return Object.keys(obj).length;
	}

	function getWords(session) {
		var n = 0, i, j;

		console.log("Trying to get words with session: " + session);
		
		if (true) { // if there is a internet connection, fetch new words -> have to do research for this
			var xhr = new XMLHttpRequest();
			var numberOfWords = userData.getNumberOfWords();
			xhr.open('GET', SESSION_ENDPOINT + BOOKMARK_SESSION + numberOfWords + "?session=" + session, false);
			xhr.onload = function () {
				var obj = JSON.parse(this.responseText);
				for (i=0; i<numberOfWords; i++) {
					if (ctxWords.measureText(String(obj[i].from)).width <= SCREEN_WIDTH - 20) {
						ctxWords.font = screen.TRANSLATION_FONT_SIZE + screen.FONT;
						if (ctxWords.measureText(String(obj[i].to)).width <= SCREEN_WIDTH - 20) {
							userData.setWordPair(i, obj[i].from, obj[i].to, obj[i].id);
						}
					}
				}
			};
			xhr.send();
		} else if (userData.areThereWords()) {  
			// no connection, but words are saved locally
		} else {
			// no connection and no words, draw some sort of message on the screen
		}
	}

	return  {

		create: function(ctx, code) {
			ctxWords = ctx;

			getWords(code);

			// var session;
			// var data = new FormData();
			// data.append('password', 'pass');

			// var xhr = new XMLHttpRequest();
			// xhr.open('POST', SESSION_ENDPOINT + USERNAME, false);

			// xhr.onload = function () {
			// 	session = parseInt(this.responseText);
			// 	console.log("session number: " + session);
			// 	// account code will equal session number in the future -> getWords(userData.getCode())
			// 	getWords(session);
			// };
			// xhr.send(data);
		},

		printWords: function() {
			userData.printWords();
		}
	};
});