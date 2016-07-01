/**
 * device.js 
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData', 'weather'],function(userData, weather) {

	function powerButtonListener() {
		try {
			tizen.power.setScreenStateChangeListener(function(prevState, currState) {
				if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
					console.log("We just woke up");
					weather.refresh();
					userData.addEvent("screenOn");
				} else {
					console.log("The display has been switched off");
					userData.addEvent("screenOff");
					userData.save();
				}
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

	return {

		create: function() {
			tizenBackButton();
		},

		listen: function(){
			powerButtonListener();
		}

	};
});