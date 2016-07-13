/**
 * settings.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['effects', 'userData'], function(effects, userData) {

	var settings;

	//definitions
	var FADING_TIME = 5;

	function fade() {
		effects.fade(settings, FADING_TIME);
	}

	return {

		create: function(printWord) {
			settings = document.getElementById("settingsPage");

			//EventListeners for the buttons in the settings: reverse, logout and profile
			document.getElementById("settingsSpace").addEventListener("click", function(){
				fade();
			});
			
			document.getElementById("reverseButton").addEventListener("click", function(){
				userData.addEvent("reverse");
				userData.setReverseStatus(!userData.getReverseStatus());
				printWord();	
			});
			document.getElementById("logOutButton").addEventListener("click", function(){
				userData.clear();
				document.location.reload(true);
			});
			
			document.getElementById("backButtonInSettings").addEventListener("click", function(){
				fade();
			});
		},

		show: function() {
			settings.style.visibility = "visible";
			effects.unfade(settings, FADING_TIME);
			setTimeout(function(){fade();}, 5000);
		}

	};

});