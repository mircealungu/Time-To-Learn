/**
 * device.js 
 *
 * made by Rick Nienhuis & Niels Haan
 */
// TODO: rename to device-listeners
define(['userData','weather', 'time'],function(userData, weather, time) {

	function screenOnOffListener() {
		try {
			tizen.power.setScreenStateChangeListener(function(prevState, currState) {
				if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
					console.log("We just woke up");
					userData.addEvent("screenOn");
					time.startUsageTracking();
					weather.refresh();
				} else {
					console.log("The display has been switched off");
					userData.addEvent("screenOff");
					time.pauseUsageTracking();
				}
				userData.saveEvents();
			});
		} catch (e) {}
	}

	function tizenBackButton() {
		document.addEventListener('tizenhwkey', function(e) {
			if (e.keyName === "back") {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
			}
		});
	}

	return function() {
			tizenBackButton();
			screenOnOffListener();			
		}
	
//
//		listen: function(){
////			M: Why don't we call this once from the create?
////			screenOnOffListener();
//		}
});