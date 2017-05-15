/**
 * userData.js
 *
 * This module keeps track of all the data for the user: words, account code
 * reverse state. The current word presented to the user will be updated here
 * in updateWordpair, this function uses a flashcard algorithm.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events', 'clickTracker'], function(events, clickTracker) {

	// save data
	var accountCode = 0;
	var wordPair = [];

	var sessionPopupShown = false;
	
	var NUMBER_OF_FLASHCARDS = 5;
	var DELETE_WORDS_ENDPOINT = "https://zeeguu.unibe.ch/api/delete_bookmark/";

 	function reverse() {
		return JSON.parse(localStorage.getItem("reverse"));
 	}

	return {

		getAllWords: function() {
			return wordPair;
		},

		addWords: function(numberOfWords, newWords) {
			wordPair = wordPair.concat(newWords);
			wordPair = wordPair.slice(0, numberOfWords);
		},

		getWordPair: function(n) {
			return wordPair[n];
		},

		areThereWords: function() {
			if (wordPair.length > 0) {
				return true;
			}
			return false;
		},

		// flashcard method is implemented here
		updateWordPair: function(wordIsRight) {
			if (wordIsRight) {
				wordPair[0].timesCorrect++;
				wordPair.splice(wordPair[0].timesCorrect * NUMBER_OF_FLASHCARDS, 0, wordPair[0]);
				wordPair.splice(0, 1);
			} else {
				wordPair[0].timesCorrect = 0;
				wordPair.splice(NUMBER_OF_FLASHCARDS, 0, wordPair[0]);
				wordPair.splice(0, 1);
			}
		},
		
		getWord: function() {
			if (reverse()) {
				return wordPair[0].translation;
			} else {
				return wordPair[0].word;
			}
		},

		removeWord: function() {
			if (wordPair.length > NUMBER_OF_FLASHCARDS) {
				wordPair.splice(0, 1);
				return true;
			} 
			return false;
		},
		
		getTranslation: function() {
			if (reverse()) {
				return wordPair[0].word;
			} else {
				return wordPair[0].translation;
			}
		},

		load: function() {
			if (localStorage.length!==0) {
				accountCode = localStorage.getItem("accountCode");
				if (localStorage.getItem("wordPair") !== null) {
				 	wordPair = JSON.parse(localStorage.getItem("wordPair"));
				}
			}
		},

		saveCode: function(code) {
			accountCode = code;
			localStorage.setItem("accountCode", accountCode);
		},

		saveWordPair: function() {
			localStorage.setItem("wordPair", JSON.stringify(wordPair));
		},

		saveEvent: function(event) {
			events.save(event, wordPair[0].id);
		},

		sendEvents: function() {
			try {
				events.send(accountCode);
			} catch(err) {
				console.log("Error during sending events: " + err);
			}
		},

		saveClick: function(pos_x, pos_y, type) {
			clickTracker.saveClick(pos_x, pos_y, type);
		},

		sendClicks: function() {
			try {
				clickTracker.sendClicks(accountCode);
			} catch(err) {
				console.log("Error during sending clicks: " + err);
			}
		},

		getCode: function() {
			return accountCode;
		},

		getReverseStatus: function() {
			return JSON.parse(localStorage.getItem("reverse"));
		},
		
		setReverseStatus: function(rev) {
			localStorage.setItem("reverse", JSON.stringify(rev));
		},

		getSessionPopupShown: function() {
			return sessionPopupShown;
		},

		setSessionPopupShown: function(bool) {
			sessionPopupShown = bool;
		},

		increaseBackgroundNumber: function() {
			localStorage.setItem("backgroundNumber", parseInt(localStorage.getItem("backgroundNumber"))+1);
		},

		getBackgroundNumber: function() {
			return parseInt(localStorage.getItem("backgroundNumber"));
		},

		setBackgroundNumber: function(background_number) {
			localStorage.setItem("backgroundNumber", background_number);
		},

		numberOfFlashcards: function() {
			return NUMBER_OF_FLASHCARDS;
		},
		
		clear: function() {
			localStorage.clear();
		}
	};
});