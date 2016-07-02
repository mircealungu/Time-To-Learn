/**
 * app.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

require(['login', 'session', 'gui', 'device'], function (login, session, gui, device) {  
	function update() {
		gui.draw();
		device.listen();
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
		device.create();
		update();
		return status;
	}

	var canvasWords = document.getElementById("wordSpace"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login(checkLogin);
});