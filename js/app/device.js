/**
 * device.js 
 *
 * made by Rick Nienhuis and Niels Haan
 */

define(['userData'],function(userData) {

	function powerButtonListener() {
		try {
			tizen.power.setScreenStateChangeListener(function(prevState, currState) {
				if (currState === 'SCREEN_NORMAL' && prevState === 'SCREEN_OFF') {
					console.log("We just woke up");
					userData.addEvent("screenOn");
				} else {
					userData.addEvent("screenOff");
					userData.printEvents();
					console.log("The display has been switched off");
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