var SESSION_ENDPOINT = 'https://zeeguu.unibe.ch/';
var BOOKMARK_SESSION = 'bookmarks_by_day?session=';
var USERNAME = 'session/i@mir.lu';

function length(obj) {
    return Object.keys(obj).length;
}

function getWords(session) {
	var n = 0, i, j;
	var data = new FormData();
	data.append('after_date', '2016-05-05T00:00:00');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', SESSION_ENDPOINT + BOOKMARK_SESSION + session, false);
	xhr.onload = function () {
		var obj = JSON.parse(this.responseText);
		for (i=0; i<length(obj); i++) {
			if (n > numberOfWords) {
				break;
			}
			for (j=0; j<length(obj[i].bookmarks); j++) {
				ctxWords.font = WORD_FONT_SIZE + FONT;
				// sentences and words that do not fit on the screen, leave them out
				if (ctxWords.measureText(String(obj[i].bookmarks[j].from)).width <= SCREEN_WIDTH - 10) {
					ctxWords.font = TRANSLATION_FONT_SIZE + FONT;
					if (ctxWords.measureText(String(obj[i].bookmarks[j].to)).width <= SCREEN_WIDTH - 10) {
						wordPair[n] = {
								"word": obj[i].bookmarks[j].from,
								"translation": obj[i].bookmarks[j].to,
								"id": obj[i].bookmarks[j].id
						};
						n++;
					}
				}
			}
		}
	};
	xhr.send(data);
}

function startNewSession() {
	var session;
	var data = new FormData();
	data.append('password', 'pass');

	var xhr = new XMLHttpRequest();
	xhr.open('POST', SESSION_ENDPOINT + USERNAME, false);
	
	xhr.onload = function () {
		session = parseInt(this.responseText);
		console.log("session number: " + session);
		getWords(session);
	};
	xhr.send(data);
}