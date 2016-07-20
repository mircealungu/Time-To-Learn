/**
 * userData.js
 *
 * This module keeps track of all the data for the user: words, account code
 * reverse state. The current word presented to the user will be updated here
 * in updateWordpair, this function uses a flashcard algorithm.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events'], function(events) {

	// save data
	var accountCode = 0;
	var wordPair = [];

	var sessionPopupShown = false;
	
	var NUMBER_OF_FLASHCARDS = 5;
	var DELETE_WORDS_ENDPOINT = "https://zeeguu.unibe.ch/delete_bookmark/";

	function printWords2() {
		var string = "words: ";
		for (var i=0; i<wordPair.length; i++) {
			string += wordPair[i].word + ", ";
		}
		console.log(string);
 	}

 	function reverse() {
		return JSON.parse(localStorage.getItem("reverse"));
 	}

	return {
		
		setWordPair: function(n, word, translation, id, context) {
			wordPair[n] = {
					"word": word,
					"translation": translation,
					"id": id,
					"context": context,
					"timesCorrect": 0
			};
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
				console.log("word is correct");
				wordPair[0].timesCorrect++;
				wordPair.splice(wordPair[0].timesCorrect * NUMBER_OF_FLASHCARDS, 0, wordPair[0]);
				console.log("new position for word " + wordPair[0].word + " = " + wordPair[0].timesCorrect * NUMBER_OF_FLASHCARDS);
				wordPair.splice(0, 1);
				printWords2();
				//this.printWords();
			} else {
				console.log("word is wrong");
				wordPair[0].timesCorrect = 0;
				wordPair.splice(NUMBER_OF_FLASHCARDS, 0, wordPair[0]);
				console.log("new position for word " + wordPair[0].word + " = " + wordPair[0].timesCorrect);
				wordPair.splice(0, 1);
				printWords2();
				//this.printWords();
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
			console.log("loading userdata..");
			if (localStorage.length===0) {
				console.log("No user data available.");
			} else {
				accountCode = localStorage.getItem("accountCode");
				console.log("loaded accountCode: " + accountCode);
				events.load();
				if (localStorage.getItem("wordPair") !== null) {
				 	wordPair = JSON.parse(localStorage.getItem("wordPair"));
				 	console.log("loaded wordpairs: " + JSON.stringify(wordPair));
				}
			}
		},

		saveCode: function(code) {
			accountCode = code;
			localStorage.setItem("accountCode", accountCode);
			console.log("accountCode saved: " + localStorage.getItem("accountCode"));
		},

		saveWordPair: function() {
			localStorage.setItem("wordPair", JSON.stringify(wordPair));
			console.log("wordPair saved: " + localStorage.getItem("wordPair"));
		},

		saveEvents: function() {
			events.print();
			events.save();
			events.clear();
		},

		sendEvents: function() {
			try {
				events.send(accountCode);
			} catch(err) {
				console.log("Error during sending: " + err);
			}
		},

		addEvent: function(event) {
			events.add(event, wordPair[0].id);
		},

		getCode: function() {
			return accountCode;
		},

		printWords: function() {
			console.log(JSON.stringify(wordPair));
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

		printEvents: function() {
			events.print();
		}, 
		
		clear: function() {
			localStorage.clear();
		}
	};
});