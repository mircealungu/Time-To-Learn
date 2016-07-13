/**
 * userData.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events'], function(events) {

	var wordPair = [];
	var accountCode = 0;
	var reverse = false;

	var numberOfFlashcards = 5;

	var DELETE_WORDS_ENDPOINT = "https://zeeguu.unibe.ch/delete_bookmark/";

	function printWords2() {
		var string = "words: ";
		for (var i=0; i<wordPair.length; i++) {
			string += wordPair[i].word + ", ";
		}
		console.log(string);
 	}

	return {
		
		setWordPair: function(n, word, translation, id) {
			wordPair[n] = {
					"word": word,
					"translation": translation,
					"id": id,
					"timesCorrect": 0,
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
				wordPair.splice(wordPair[0].timesCorrect * numberOfFlashcards, 0, wordPair[0]);
				console.log("new position for word " + wordPair[0].word + " = " + wordPair[0].timesCorrect * numberOfFlashcards);
				wordPair.splice(0, 1);
				printWords2();
				//this.printWords();
			} else {
				console.log("word is wrong");
				wordPair[0].timesCorrect = 0;
				wordPair.splice(numberOfFlashcards, 0, wordPair[0]);
				console.log("new position for word " + wordPair[0].word + " = " + wordPair[0].timesCorrect);
				wordPair.splice(0, 1);
				printWords2();
				//this.printWords();
			}
		},
		
		getWord: function() {
			if(reverse){
				return wordPair[0].translation;
			}else{
				//console.log("index in wordPair: " + flashcardsToShow[index]);
				return wordPair[0].word;
			}
		},

		removeWord: function() {
			if (wordPair.length > 10) {
				wordPair.splice(0, 1);
				return true;
			} 
			return false;
		},

		deleteFromServer: function() {
			//https://zeeguu.unibe.ch/delete_bookmark/5474?session=56510527
			var xhr = new XMLHttpRequest();
			console.log("trying to delete word: " + wordPair[0].word);
			xhr.open('POST', DELETE_WORDS_ENDPOINT + wordPair[0].id + "?session=" + accountCode, true);
			xhr.onload = function() {
				if (this.responseText === "OK") {
					console.log("SUCCES: word is deleted");
				} else {
					console.log("FAIL: word could not be deleted");
				}
			};
			xhr.send(data);
		},
		
		getTranslation: function() {
			if (reverse) {
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
			return reverse;
		},
		
		setReverseStatus: function(rev) {
			reverse = rev;
		},

		printEvents: function() {
			events.print();
		}, 
		
		clear: function() {
			localStorage.clear();
		}
	};
});