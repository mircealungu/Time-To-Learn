/**
 * session.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData', 'login'], function(userData, login) {

	var ctxWords, status;

	var NUMBER_OF_WORDS = 50;
	var MAX_WORD_LENGTH = 340;
	var MAX_TRANSLATION_LENGTH = 280;
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
		var i, j;

		console.log("Trying to get words with session: " + session);
		
		try { 
			var xhr = new XMLHttpRequest();
			xhr.open('GET', SESSION_ENDPOINT + BOOKMARK_SESSION + NUMBER_OF_WORDS + "?session=" + session, false);
			xhr.onload = function () {
				try {
					var obj = JSON.parse(this.responseText);
					var wordNumber = 0;
					if (Object.keys(obj).length < 10) {
						status = "TOO_FEW_WORDS";
					} else {
						for (i=0; i<Object.keys(obj).length; i++) {
							ctxWords.font = WORD_FONT;
							if (ctxWords.measureText(String(obj[i].from)).width <= MAX_WORD_LENGTH && ctxWords.measureText(String(obj[i].to)).width <= MAX_WORD_LENGTH) {
								ctxWords.font = TRANSLATION_FONT;
								if (ctxWords.measureText(String(obj[i].from)).width <= MAX_TRANSLATION_LENGTH && ctxWords.measureText(String(obj[i].to)).width <= MAX_TRANSLATION_LENGTH) {
									userData.setWordPair(wordNumber, obj[i].from, obj[i].to, obj[i].id);
									wordNumber++;
								}
							}
						}
						console.log("number of words loaded: " + wordNumber);
						userData.saveWordPair();
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

			if (!userData.areThereWords()) {
				getWords(code);
			} else {
				status = "SUCCESS";
				console.log("Using words which were already saved.");
			}
		},

		printWords: function() {
			userData.printWords();
		},
		
		getStatus: function() {
			return status;
		}
	};
});