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
	var receivedWords = [];

	var NUMBER_OF_WORDS = 50;
	var MAX_WORD_LENGTH = 340;
	var MAX_TRANSLATION_LENGTH = 280;
	var WORD_FONT = "45px Arial";
	var TRANSLATION_FONT = "35px Arial";

	var SESSION_ENDPOINT = 'https://zeeguu.unibe.ch/api/';
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

	function setWordPair(n, word, translation, id, context) {
		receivedWords[n] = {
			"word": word,
			"translation": translation,
			"id": id,
			"context": context,
			"timesCorrect": 0
		};
	}

	function getNewWordPairs(newWords, currentWords) {
		if (currentWords.length === 0) {
			return newWords;
		} else {
			for (var j=0; j<currentWords.length; j++) {
				for (var i=0; i<newWords.length; i++) {
					if (currentWords[j].id === newWords[i].id) {
						newWords.splice(i, 1);
						break;
					}
				}
			}
		}
		return newWords;
	}

	return  {

		create: function(ctx, code) {
			ctxWords = ctx;

			if (!userData.areThereWords()) {
				this.getWords(code, false);
				this.updateWords();
			} else {
				status = "SUCCESS";
			}
		},

		getWords: function(session, asynchronous) {
			if (userData.getAllWords().length < NUMBER_OF_WORDS) {
				try { 
					var xhr = new XMLHttpRequest();
					xhr.open('GET', SESSION_ENDPOINT + BOOKMARK_SESSION + NUMBER_OF_WORDS + "?session=" + session, asynchronous);
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
											setWordPair(wordNumber, obj[i].from, obj[i].to, obj[i].id, obj[i].context);
											wordNumber++;
										}
									}
								}
								// extract the new words
								receivedWords = getNewWordPairs(receivedWords, userData.getAllWords());
								status = "SUCCESS";
							}
						} catch(err) {
						// the session number is unknown to the server
						status = "WRONG_SESSION_NUMBER";
						}
					};
					xhr.send();
				} catch(err) {
					// there is no internet connection
					status = "NO_CONNECTION";
				}	
			}
		},

		updateWords: function() {
			if (userData.getAllWords().length < NUMBER_OF_WORDS) {
				userData.addWords(NUMBER_OF_WORDS, receivedWords);
				receivedWords = [];
				userData.saveWordPair();
			} 
		},
		
		getStatus: function() {
			return status;
		}
	};
});