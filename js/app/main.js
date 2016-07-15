/**
 * app.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

require(['login', 'session', 'gui', 'device'], function (login, session, gui, device) {  
	
	function updateScreenEverySecond() {
		gui.draw();
		setTimeout(update, 1000);
	}

	function checkLogin(code) {
		session.create(ctxWords, code);
		session.printWords();
		var status = session.getStatus();
		if (status !== "SUCCESS") {
			return status;
		}
		gui.create(ctxWords);
		device();
		updateScreenEverySecond();
		return status;
	}

	var canvasWords = document.getElementById("wordCanvas"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login(checkLogin);
});