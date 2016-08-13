/**
 * settings.js
 *
 * This module implements the settings interface of the app. The settings menu will be shown
 * if you double tap the time. The user can press 'reverse', 'profile' or 'logout'.
 * The menu will fade away in 5s if the user does not do anything.
 * 
 * made by Rick Nienhuis & Niels Haan
 */

define(['effects', 'userData', 'profile'], function(effects, userData, profile) {

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
				userData.saveEvent("reverse");
				userData.setReverseStatus(!userData.getReverseStatus());
				printWord();	
			});
			document.getElementById("profileButton").addEventListener("click", function(){
				profile.show();
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
		}

	};

});