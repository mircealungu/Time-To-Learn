/**
 * session.js
 *
 * This module tries to get words from the server when the user logs in for the first time.
 * The status variable is used by login.js. The status can be: SUCCES, WRONG_SESSION_NUMBER, 
 * TOO FEW WORDS or NO CONNECTION.
 *
 * If the user has already logged in once, the words saved in the storage will be used.
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

	function length(obj) {
		return Object.keys(obj).length;
	}

	function isWordFittingTheScreen(word, length) {
		if (ctxWords.measureText(String(word)).width <= length) {
			return true;
		}
		return false;
	}

	function getWords(session) {
		console.log("Trying to get words with session: " + session);
		
		try { 
			var xhr = new XMLHttpRequest();
			xhr.open('GET', SESSION_ENDPOINT + BOOKMARK_SESSION + NUMBER_OF_WORDS + "?session=" + session, false);
			xhr.onload = function () {
				try {
					var obj = JSON.parse(this.responseText);
					var wordNumber = 0;
					if (length(obj) < userData.numberOfFlashcards()) {
						status = "TOO_FEW_WORDS";
					} else {
						for (var i = 0; i < length(obj); i++) {
							ctxWords.font = WORD_FONT;
							// test both cases, because user may reverse the words
							if (isWordFittingTheScreen(obj[i].from, MAX_WORD_LENGTH) && isWordFittingTheScreen(obj[i].to, MAX_WORD_LENGTH)) {
								ctxWords.font = TRANSLATION_FONT;
								if (isWordFittingTheScreen(obj[i].from, MAX_TRANSLATION_LENGTH) && isWordFittingTheScreen(obj[i].to, MAX_TRANSLATION_LENGTH)) {
									userData.setWordPair(wordNumber, obj[i].from, obj[i].to, obj[i].id, obj[i].context);
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

		updateWords: function() {
			console.log("trying to update words..");
			/**
			 * This part is waiting for a implementation on the server side.
			 * Wrong transaltion doesn't effect the words in a account. The word
			 * won't be deleted.
			 *
			 * The endpoint for booksmarks_to_study also doesn't work yet. For example
			 * if we ask for 50 words and the account only has 25, the server returns 10 words
			 * So even if a word gets deleted, updating the words probably won't 
			 * be feasible, since the server will just return 9 instead of 10 and we cannot add
			 * a new word. So the server should always return the number of words asked, unless the 
			 * account doesn't have the asked number of words. In that case the server should return 
			 * all the words the account has.
			 */
		},

		printWords: function() {
			userData.printWords();
		},
		
		getStatus: function() {
			return status;
		}
	};
});