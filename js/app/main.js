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
		gui.render();
		setTimeout(updateScreenEverySecond, 1000);
	}
	
	/* goToMainPage() sets the right html "<div>" to display. 
     * The drawing of other elements is done by other functions.
     */
	function goToMainPage() {
//        document.getElementById("languageFlags").style.display="none";
        document.getElementById("loadingPage").style.display="none";
        document.getElementById("mainPage").style.display = "block";
    }
	
	function setLoadScreen(){
		 document.getElementById("languageFlags").style.display="none";
	     document.getElementById("loadingPage").style.display="block";
	}

	function checkLogin(code) {
		session.create(ctxWords, code);
		var status = session.getStatus();
		if (status !== "SUCCESS") {
			return status;
		}
		gui.create(ctxWords);
		goToMainPage();
		deviceListeners();
		updateScreenEverySecond();
		return status;
	}

	var canvasWords = document.getElementById("wordCanvas"); 
	var ctxWords = canvasWords.getContext("2d");
	
	new login(checkLogin);
});