/**
 * main.js
 *
 * This is the main module. A new login is made with a callback function checkLogin().
 * The screen will be updated every second to draw the elements in the gui.
 *
 * made by Rick Nienhuis & Niels Haan
 */

require(['login', 'session', 'gui', 'deviceListeners'], function (login, session, gui, deviceListeners) {  
	function updateScreenEverySecond() {
		gui.draw();
		setTimeout(updateScreenEverySecond, 1000);
	}

	function checkLogin(code) {
		session.create(ctxWords, code);
		var status = session.getStatus();
		if (status !== "SUCCESS") {
			return status;
		}
		gui.create(ctxWords);
		deviceListeners();
		updateScreenEverySecond();
		return status;
	}

	var canvasWords = document.getElementById("wordCanvas"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login(checkLogin);
});