/**
 * session.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData'], function(userData) {

	var ctxWords;

	var SCREEN_WIDTH = 360;

	var SESSION_ENDPOINT = 'https://zeeguu.unibe.ch/';
	var BOOKMARK_SESSION = 'bookmarks_by_day?session=';
	var USERNAME = 'session/i@mir.lu';
	var AFTER_DATE = '2016-05-05T00:00:00';

	function length(obj) {
		return Object.keys(obj).length;
	}

	function getWords(session) {
		console.log(ctxWords);
		var n = 0, i, j;
		var data = new FormData();
		data.append('after_date', AFTER_DATE);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', SESSION_ENDPOINT + BOOKMARK_SESSION + session, false);
		xhr.onload = function () {
			var obj = JSON.parse(this.responseText);
			for (i=0; i<length(obj); i++) {
				if (n > userData.getNumberOfWords()) {
					break;
				}
				for (j=0; j<length(obj[i].bookmarks); j++) {
					ctxWords.font = screen.WORD_FONT_SIZE + screen.FONT;
					// sentences and words that do not fit on the screen, leave them out
					if (ctxWords.measureText(String(obj[i].bookmarks[j].from)).width <= SCREEN_WIDTH - 10) {
						ctxWords.font = screen.TRANSLATION_FONT_SIZE + screen.FONT;
						if (ctxWords.measureText(String(obj[i].bookmarks[j].to)).width <= SCREEN_WIDTH - 10) {
							userData.setWordPair(n, obj[i].bookmarks[j].from, obj[i].bookmarks[j].to, obj[i].bookmarks[j].id);
							n++;
						}
					}
				}
			}
		};
		xhr.send(data);
	}

	return  {

		create: function(ctx) {
			ctxWords = ctx;

			var session;
			var data = new FormData();
			data.append('password', 'pass');

			var xhr = new XMLHttpRequest();
			xhr.open('POST', SESSION_ENDPOINT + USERNAME, false);

			xhr.onload = function () {
				session = parseInt(this.responseText);
				console.log("session number: " + session);
				// account code will equal session number in the future -> getWords(userData.getCode())
				getWords(session);
			};
			xhr.send(data);
		},

		printWords: function() {
			userData.printWords();
		}
	};
});