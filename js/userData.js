var wordPair = [];
var numberOfWords = 50;
var numberOfEvents = 0;
var userEvents = [];
var accountCode;

function loadUserData() {
	if (localStorage.length===0) {
		console.log("No user data available.");
	} else {
		for (var i = 0; i < localStorage.length; i++) {
			console.log("key: "+ localStorage.key(i) + " item: " + localStorage.getItem(localStorage.key(i)));
			if (localStorage.key(i) === "numberOfGlanceEvents") {
				//numberOfGlanceEvents = localStorage.getItem(localStorage.key(i));
			}
		}
	}
}

function getAccountCode() {
	return accountCode;
}