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

	var canvasWords = document.getElementById("wordSpace"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login();
	session.create(ctxWords);
	session.printWords();
	gui.create(ctxWords);
	device.create();
	update();
});