/**
 * userData.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events'], function(events) {

	var wordNumber = 5;
	var wordPair = [];
	var interval = [];
	
	var flashcardsToShow = [0,1,2,3,4];
	var numberOfFlashcards = 5;
	var index = 0;
	var indexInterval = 0;
	
	var numberOfWords;
	var accountCode = 0;
	var reverse = false;

	var sunset = 1320; // default 22:00
	var sunrise = 360; // default 6:00
	
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

		areThereWords: function() {
			if (wordPair.length > 0) {
				return true;
			}
			return false;
		},
		
		flashCardMethod: function(wordIsRight) {
			if(wordIsRight) {
				flashcardsToShow[index] = wordNumber;
				index++;
				this.nextWord();
			} else {
				index++;
			}
			
			if(index === NUMBER_OF_FLASH_CARDS){
				index = 0;
			}
		},

		initializeIntervals: function() {
			var counter = 0;
			var i;
			for (i=0; counter<numberOfWords; i++) {
				interval[i] = counter;
				counter = counter+5;
			}
			interval[i] = numberOfWords;
			console.log("intervals: " + interval);
		},
		
		improvedFlashCardMethod: function(wordIsRight) {
			console.log("length: " + wordPair.length);		
			if(wordIsRight) {
				if (wordNumber === interval[indexInterval+2]) {
					flashcardsToShow.splice(index, 1);
					numberOfFlashcards--;
					if (numberOfFlashcards === 0) {
						if (wordNumber === numberOfWords) {
							indexInterval = 0;
							wordNumber = 5;
							flashcardsToShow = [0,1,2,3,4];
							numberOfFlashcards = 5;
							index = 0;
						} else {
							indexInterval++;
							flashcardsToShow = [interval[indexInterval], interval[indexInterval]+1, interval[indexInterval]+2, interval[indexInterval]+3, interval[indexInterval]+4];
							numberOfFlashcards = 5;
							wordNumber = interval[indexInterval+1];
							index = 0;
						}
					}
					console.log("wN: " + wordNumber);
				} else {
					flashcardsToShow[index] = wordNumber;
					console.log("practice words from " + interval[indexInterval] + " to " + interval[indexInterval+2] + " | wN = " + wordNumber);
					wordNumber++;
					index++;
				}
			} else {
				index++;
			}
			
			if(index >= numberOfFlashcards){
				index = 0;
			}
			console.log(numberOfFlashcards + " flashcards: " + flashcardsToShow + " | shown word: " + flashcardsToShow[index] + " index: " + index);
		},
		
		getWord: function() {
			if(reverse){
				return wordPair[flashcardsToShow[index]].translation;
			}else{
				console.log("index in wordPair: " + flashcardsToShow[index]);
				return wordPair[flashcardsToShow[index]].word;
			}
		},

		removeWord: function() {
			if (numberOfWords > 10) {
				wordPair.splice(flashcardsToShow[index], 1);
				numberOfWords--;
				return true;
			} 
			return false;
		},
		
		getTranslation: function() {
			if(reverse){
				return wordPair[flashcardsToShow[index]].word;
			}else{
				return wordPair[flashcardsToShow[index]].translation;
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
				if (localStorage.getItem("wordNumber") !== null) {
					wordNumber = localStorage.getItem("wordNumber");
					console.log("loaded wordNumber: " + wordNumber);
				}
				if (localStorage.getItem("index") !== null) {
					index = localStorage.getItem("index");
					console.log("loaded index: " + index);
				}
				if (localStorage.getItem("indexInterval") !== null) {
					indexInterval = localStorage.getItem("indexInterval");
					console.log("loaded indexInterval: " + indexInterval);
				}
				if (localStorage.getItem("numberOfFlashcards") !== null) {
					numberOfFlashcards = localStorage.getItem("numberOfFlashcards");
					console.log("loaded numberOfFlashcards: " + numberOfFlashcards);
				}
				if (localStorage.getItem("flashcardsToShow") !== null) {
					flashcardsToShow = JSON.parse(localStorage.getItem("flashcardsToShow"));
					console.log("loaded flashcards: " + flashcardsToShow);
				}
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
			console.log(localStorage.getItem("wordPair"));
		},

		saveEvents: function() {
			events.print();
			events.save();
			events.clear();
		},

		saveCurrentState: function() {
			localStorage.setItem("wordNumber", wordNumber);
			// index indicates current flashcard, if the last flashcard was answered, then the first 
			// should be shown, otherwise go to next flashcard, if user starts up the app again.
			if (index === 4) {
				localStorage.setItem("index", 0);
			} else {
			 	localStorage.setItem("index", index + 1);
			}
			localStorage.setItem("flashcardsToShow", JSON.stringify(flashcardsToShow));
			localStorage.setItem("indexInterval", indexInterval);
			localStorage.setItem("numberOfFlashcards", numberOfFlashcards);
		},
		
		sendEvents: function() {
			try {
				events.send(accountCode);
			} catch(err) {
				console.log("Error during sending: " + err);
			}
		},
		
		save: function() {
			if ("localStorage" in window) {
				localStorage.setItem("accountCode", accountCode);
				console.log("accountCode saved: " + accountCode);
				localStorage.setItem("wordNumber", wordNumber);
				console.log("wordNumber saved: " + wordNumber);
				events.print();
				events.save();
				events.clear();
				if (events.readyToSend()) { 
					console.log("ready to send...");
					try {
						events.send(accountCode); 
					} catch(err) {
						console.log("Error during sending: " + err);
					}
				}
				// localStorage.setItem("wordPair", JSON.stringify(wordPair));
				// console.log("words saved: " + JSON.stringify(wordPair));
				// more stuff to be saved here.
			} else {
				console.log("no localStorage in window");
			}
		},

		addEvent: function(event) {
			console.log("wordNumber is " + flashcardsToShow[index]);
			events.add(event, wordPair[flashcardsToShow[index]].id);
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

		initNumberOfWords: function() {
			//console.log("numberOfWords :" + nrOfWords);
			numberOfWords = wordPair.length;
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
			if(wordNumber === numberOfWords) {
				wordNumber = 0;
			}
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