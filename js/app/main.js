/**
 * app.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

require(['login', 'session', 'gui', 'device', 'weather'], function (login, session, gui, device, weather) {  
	function update() {
		gui.draw();
		device.listen();
		setTimeout(update, 1000);
	}

	function loginSucces() {
		session.create(ctxWords);
		session.printWords();
		gui.create(ctxWords);
		device.create(weather);
		update();
	}

	function checkLogin(code) {
		session.create(ctxWords, code);
		session.printWords();
		status = session.getStatus();
		if (status !== "SUCCES") {
			return status;
		}
		gui.create(ctxWords);
		device.create();
		return status;
	}

	function loginFail() {
		login.showPopup();
	}

	var canvasWords = document.getElementById("wordSpace"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login(loginSucces);
});