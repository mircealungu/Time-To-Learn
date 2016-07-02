/**
 * session.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData', 'login'], function(userData, login) {

	var ctxWords, status;

	var NUMBER_OF_WORDS = 50;
	var SCREEN_WIDTH = 360;
	var WORD_FONT = "45px Arial";
	var TRANSLATION_FONT = "35px Arial";

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
		
		try { // if there is a internet connection, fetch new words -> have to do research for this
			var xhr = new XMLHttpRequest();
			xhr.open('GET', SESSION_ENDPOINT + BOOKMARK_SESSION + NUMBER_OF_WORDS + "?session=" + session, false);
			xhr.onload = function () {
				try {
					var obj = JSON.parse(this.responseText);
					var wordNumber = 0;
					if (Object.keys(obj).length < 5) {
						status = "TOO_FEW_WORDS";
					} else {
						for (i=0; i<Object.keys(obj).length; i++) {
							ctxWords.font = WORD_FONT;
							if (ctxWords.measureText(String(obj[i].from)).width <= SCREEN_WIDTH - 20) {
								ctxWords.font = TRANSLATION_FONT;
								if (ctxWords.measureText(String(obj[i].to)).width <= SCREEN_WIDTH - 80) {
									userData.setWordPair(wordNumber, obj[i].from, obj[i].to, obj[i].id);
									wordNumber++;
								}
							}
						}
						userData.setNumberOfWords(wordNumber);
						userData.saveWordPair();
						//console.log(wordNumber + " words added");
						status = "SUCCESS";
					}
				} catch(err) {
					// the session number is unknown to the server
					console.log("wrong session number: " + err);
					status = "WRONG_SESSION_NUMBER";
				}
			};
			xhr.send();
		} catch(err) {
			// there is no internet connection
			console.log("no internet connection: " + err);
			status = "NO_CONNECTION";
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
		},
		
		getStatus: function() {
			return status;
		}
	};
});