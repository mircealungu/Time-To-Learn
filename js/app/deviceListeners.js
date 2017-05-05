/**
 * deviceListeners.js 
 *
 * In this module the listeners of the watch are implemented, there are two listeners:
 * 
 * screenOnOffListener -> screenOn and screenOff events are added here, so they 
 * can be send later to the server.
 *
 * tizenBackButton -> The implementation for the right upper button on the watch, this can be 
 * used to close menu, settings and profile. 
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData','weather', 'time', 'session'],function(userData, weather, time, session) {

	function hideAllPages() {
		document.getElementById("menuPage").style.visibility = "hidden";
		document.getElementById("settingsPage").style.visibility = "hidden";
		document.getElementById("profilePage").style.visibility = "hidden";
	}

	function screenOn() {
		userData.sendClicks();
		userData.saveEvent("screenOn");
		time.startUsageTracking();
		weather.refresh();
		session.getWords(userData.getCode(), true);
	}

	function screenOff() {
		session.updateWords();
		userData.saveEvent("screenOff");
		hideAllPages();
		time.pauseUsageTracking();
		time.resetSessionTime();
		userData.setSessionPopupShown(false);
	}

	function screenListener() {
		try {
			tizen.power.setScreenStateChangeListener(function(prevState, currState) {
				if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
					screenOn();
				} else {
					screenOff();
				}
			});
		} catch (e) {}
	}

	function tizenBackButton() {
		window.addEventListener('tizenhwkey', function(e) {
			if (e.keyName === "back") {
				try {
					// to simulate changing the watchface uncomment this line.
					//tizen.application.getCurrentApplication().exit();
					
					// hideAllPages in backButton works only in a tizen application
					// and not in a watchface.
					// hideAllPages();
				} catch (ignore) {}
			}
		});
	}

	return function() {
			tizenBackButton();
			screenListener();
	};
});