/**
 * userData.js
 *
 * made by Rick Nienhuis and Niels Haan
 */

define(['events'], function(events) {

	var wordNumber = 0;
	var wordPair = [];
	var numberOfWords = 50;
	var numberOfEvents = 0;
	
	var accountCode;

	return {
		
		setWordPair: function(n, word, translation, id) {
			wordPair[n] = {
					"word": word,
					"translation": translation,
					"id": id
			};
		},

		getWordPair: function(n) {
			return wordPair[n];
		},

		load: function() {
			if (localStorage.length===0) {
				console.log("No user data available.");
			} else {
				for (var i = 0; i < localStorage.length; i++) {
					console.log("key: "+ localStorage.key(i) + " item: " + localStorage.getItem(localStorage.key(i)));
				}
			}
		},

		addEvent: function(event) {
			events.add(event, wordPair[wordNumber].id);
		},

		getAccountCode: function() {
			return accountCode;
		},

		getNumberOfWords: function() {
			return numberOfWords;
		},

		printWords: function() {
			console.log(JSON.stringify(wordPair));
		},

		getWordNumber: function() {
			return wordNumber;
		},

		setWordNumber: function(number) {
			wordNumber = number;
		},

		nextWord: function() {
			wordNumber++;
		},

		printEvents: function() {
			events.print();
		}
	};
});