/**
 * userData.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['events'], function(events) {

	var wordNumber = 5;
	var wordPair = [];
	
	var wordsToShow = [0,1,2,3,4];
	var NUMBER_OF_FLASH_CARDS = 5;
	var counter = 0;
	
	var numberOfWords = 50;
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
			if (wordPair.isEmpty()) {
				return true;
			}
			return false;
		},

		deleteWordPair: function() {
			wordPair.splice(wordNumber, 1);
			numberOfWords--;
			if (numberOfWords === 0) {
				// We have to draw some sort of message on the gui for this.
				console.log("No words left!");
			}
		},
		
		flashCardMethod: function(wordIsRight) {
			if(wordIsRight) {
				wordsToShow[counter] = wordNumber;
				counter++;
				this.nextWord();
			} else {
				counter++;
			}
			
			if(counter === NUMBER_OF_FLASH_CARDS){
				counter = 0;
			}
		},
		
		getWord: function() {
			if(reverse){
				return wordPair[wordsToShow[counter]].translation;
			}else{
				return wordPair[wordsToShow[counter]].word;
			}
		},
		
		getWord2: function(n) {
			if(reverse){
				return wordPair[n].translation;
			}else{
				return wordPair[n].word;
			}
		},
		
		getTranslation: function() {
			if(reverse){
				return wordPair[wordsToShow[counter]].word;
			}else{
				return wordPair[wordsToShow[counter]].translation;
			}
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

						
					} else if (localStorage.key(i) === "wordNumber") {
						wordNumber = localStorage.getItem(localStorage.key(i));
						console.log("wordNumber loaded: " + wordNumber);
					// } else if (localStorage.key(i) === "events") {
					// 	events.load(localStorage.getItem(localStorage.key(i)));
					// } else if (localStorage.key(i) == "wordPair") {
					// 	wordPair = JSON.parse(localStorage.getItem(localStorage.key("wordPair")));
					// 	console.log("words loaded: " + JSON.stringify(wordPair));
					// 	// more stuff to follow.
					} else {

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
		}
	};
});