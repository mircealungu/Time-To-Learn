/**
 * userData.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events'], function(events) {

	var wordNumber = 0;
	var wordPair = [];
	var numberOfWords = 50;
	var accountCode = 0;

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
					if (localStorage.key(i) === "accountCode") {
						accountCode = localStorage.getItem(localStorage.key(i));
						console.log("accountCode loaded: " + accountCode);

						// no login screen needed, because user already entered accountCode 
						var d1 = document.getElementById("login");
						var d2 = document.getElementById("mainPage");

						d1.style.display = "none";
						d2.style.display = "block";
					}
					if (localStorage.key(i) === "wordNumber") {
						wordNumber = localStorage.getItem(localStorage.key(i));
						console.log("wordNumber loaded: " + wordNumber);
					}
				}
			}
		},
		
		save: function() {
			if ("localStorage" in window) {
				localStorage.setItem("accountCode", accountCode);
				console.log("accountCode saved: " + accountCode);
				localStorage.setItem("wordNumber", wordNumber);
				console.log("wordNumber saved: " + wordNumber);
				// more stuff to be saved here.
			} else {
				console.log("no localStorage in window");
			}
		},

		addEvent: function(event) {
			events.add(event, wordPair[wordNumber].id);
		},

		getCode: function() {
			return accountCode;
		},

		setCode: function(code) {
			accountCode = code;
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