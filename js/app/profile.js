/**
 * profile.js
 *
 * This module implements the profile interface. This interface will be shown
 * if you double tap the time and select 'profile' in settings. The user will be able to scroll
 * through his achievements: words learned, total time, longest session time and
 * learning streak.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['time', 'effects', 'popup', 'userData'], function(time, effects, popup, userData) {

	var profile, ctx, ctxPageIcon;

	var wordsLearned = 0;
	var currentLearningStreak = 1;
	var dateLastActive = null;

	var medal = ["assets/medal_words_learned_for_profile.png",
	              "assets/medal_total_time_for_profile.png",
	              "assets/medal_longest_session_for_profile.png",
	              "assets/medal_longest_streak_for_profile.png"];
	var medalPos = 0;

	var SCREEN_WIDTH = 360;
	var TITLE_FONT = "40px Arial";
	var TEXT_FONT = "25px Arial";
	var FADING_TIME = 5;

	// definitions coordinates 
	var PROFILE_TITLE_POSY = 65;

	var MEDAL_POS_X = 90;
	var MEDAL_POS_Y = 80;
	var MEDAL_WIDTH = 180;
	var MEDAL_HEIGHT = 196;
	
	var PROFILE_TEXT_HEIGHT_1 = 220;
	var PROFILE_TEXT_HEIGHT_2 = 260;
	
	var PAGE_ICON_POS_1 = 10;
	var PAGE_ICON_POS_2 = 30;
	var PAGE_ICON_POS_3 = 50;
	var PAGE_ICON_POS_4 = 70;
	
	var PAGE_ICON_POS_Y_RADIUS = 9;
	var PAGE_ICON_RADIUS = 7;

	// definitions page icon colors
	var NON_DISPLAYED_PAGE_ICON_COLOR = "#C3C3C3";
	var DISPLAYED_PAGE_ICON_COLOR = "#FFFFFF";


	function initListeners() {
			document.getElementById("leftInProfile").addEventListener("click", function(){
				drawPreviousMedal();
			});
			document.getElementById("rightInProfile").addEventListener("click", function(){
				drawNextMedal();
			});
			document.getElementById("backButtonInProfile").addEventListener("click", function(){
				effects.fade(profile, FADING_TIME);
			});
	}

	function checkNumberOfDigits(value) {
		if (value === 0) {
			value = "00";
		} else if (value > 0 && value < 10) {
			value = "0" + value;
		} 
		return value;
	}

	function secondsToHoursMinutesSeconds(sec) {
		var hours = checkNumberOfDigits(Math.floor(sec / 3600));
		var minutes = checkNumberOfDigits(Math.floor(sec % 3600 / 60));
		var seconds = checkNumberOfDigits(Math.floor(sec % 3600 % 60));
		return hours + ":" + minutes + ":" + seconds;
	}

	function drawNonDisplayedPageIcons(start) {
		for (var i=0; i<medal.length; i++) {
			ctxPageIcon.beginPath();
			ctxPageIcon.arc(start + i*20, PAGE_ICON_POS_Y_RADIUS, PAGE_ICON_RADIUS, 0, 2 * Math.PI);
			ctxPageIcon.fillStyle = NON_DISPLAYED_PAGE_ICON_COLOR;
			ctxPageIcon.fill();
		}
	}
	
	function drawDisplayedPageIcon(pos_x) {
		ctxPageIcon.beginPath();
		ctxPageIcon.arc(pos_x, PAGE_ICON_POS_Y_RADIUS, PAGE_ICON_RADIUS, 0, 2 * Math.PI);
		ctxPageIcon.fillStyle = DISPLAYED_PAGE_ICON_COLOR;
		ctxPageIcon.fill();
	}
	
	function drawPageIcon(pos_x) {
		ctxPageIcon = document.getElementById("profilePageIconCanvas").getContext("2d");
		ctxPageIcon.clearRect(0, 0, 80, 20);
		drawNonDisplayedPageIcons(PAGE_ICON_POS_1);
		drawDisplayedPageIcon(pos_x);
	}
	
	function drawMedal(position) {
		ctx.font = TEXT_FONT;
		ctx.textAlign = "center";
		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img, MEDAL_POS_X, MEDAL_POS_Y, MEDAL_WIDTH, MEDAL_HEIGHT);
			ctx.font = TEXT_FONT;
			ctx.textAlign = "center";
			switch (position) {
			case 0:
				ctx.fillText("words learned:", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_1);
				if (wordsLearned !== 1) {
					ctx.fillText(wordsLearned + " words", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				} else {
					ctx.fillText(wordsLearned + " word", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				}
				drawPageIcon(PAGE_ICON_POS_1);
				break;
			case 1:
				ctx.fillText("total time:", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_1);
				ctx.fillText(secondsToHoursMinutesSeconds(localStorage.getItem("totalTime")), SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				drawPageIcon(PAGE_ICON_POS_2);
				break;
			case 2:
				ctx.fillText("longest session:", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_1);
				ctx.fillText(secondsToHoursMinutesSeconds(localStorage.getItem("longestSession")), SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				drawPageIcon(PAGE_ICON_POS_3);
				break;
			case 3:
				ctx.fillText("learning streak:", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_1);
				if(localStorage.getItem("longestLearningStreak") > 1) {
					ctx.fillText(localStorage.getItem("longestLearningStreak") + " days", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				} else {
					ctx.fillText("none", SCREEN_WIDTH/2, PROFILE_TEXT_HEIGHT_2);
				}
				drawPageIcon(PAGE_ICON_POS_4);
				break;
			}
		};
		img.src = medal[position];
	}
	
	function drawPreviousMedal() {
		medalPos--;
		if(medalPos < 0) {
			medalPos = medal.length-1;
		}
		drawMedal(medalPos);
	}
	
	function drawNextMedal() {
		medalPos++;
		if(medalPos > medal.length-1) {
			medalPos = 0;
		}

		drawMedal(medalPos);
	}

	function isSameDay(date_a, date_b) {
		if (date_a.getFullYear() === date_b.getFullYear() && date_a.getMonth() === date_b.getMonth() && date_a.getDate() === date_b.getDate()) {
			return true;
		} 
		return false;
	}

	return {

		create: function() {
			if (localStorage.getItem("totalTime") === null) {
				localStorage.setItem("totalTime", 0);
			} else {
				time.setTotalTime(localStorage.getItem("totalTime"));
			}
			if (localStorage.getItem("longestSession") === null) {
				localStorage.setItem("longestSession", 0);
			} 
			if (localStorage.getItem("wordsLearned") !== null) {
				wordsLearned = localStorage.getItem("wordsLearned");
			}
			if (localStorage.getItem("currentLearningStreak") !== null) {
				currentLearningStreak = localStorage.getItem("currentLearningStreak");
			}
			if (localStorage.getItem("dateLastActive") !== null) {
				dateLastActive = new Date(Date.parse(localStorage.getItem("dateLastActive")));
			}
			if (localStorage.getItem("longestLearningStreak") === null) {
				localStorage.setItem("longestLearningStreak", 1);
			}
			initListeners();
			popup.medalInitialization();
		},

		refresh: function() {
			localStorage.setItem("totalTime", time.getTotalTime());
			if (time.getTotalTime() !== 0 && (time.getTotalTime() === 900 || time.getTotalTime() === 1800 || time.getTotalTime() % 3600 === 0)) {
				popup.forTotalTime(secondsToHoursMinutesSeconds(time.getTotalTime()));
			}
			if (time.getSessionTime() > localStorage.getItem("longestSession")) {
				localStorage.setItem("longestSession", time.getSessionTime());
				if (!userData.getSessionPopupShown()) {
					popup.forSessionTime();
					userData.setSessionPopupShown(true);
				}
			}
		},

		save: function() {
			localStorage.setItem("wordsLearned", wordsLearned);
			localStorage.setItem("currentLearningStreak", currentLearningStreak);
			localStorage.setItem("dateLastActive", dateLastActive);
			if (currentLearningStreak > localStorage.getItem("longestLearningStreak")) {
				localStorage.setItem("longestLearningStreak", currentLearningStreak);
				popup.forLearningStreak(currentLearningStreak);
			}
		},

		getWordsLearned: function() {
			return wordsLearned;
		},

		increaseWordsLearned: function() {
			wordsLearned++;
			if (wordsLearned !== 0 && (wordsLearned  === 1 || wordsLearned % 10 === 0)) {
				popup.forWordsLearned(wordsLearned);
			}
		},

		userIsActive: function() {
			if (dateLastActive === null) {
				dateLastActive = new Date();
			} else {
				var today = new Date();
				if (!isSameDay(today, dateLastActive)) {
					dateLastActive.setDate(dateLastActive.getDate() + 1);
					if (isSameDay(today, dateLastActive)) {
						currentLearningStreak++;
					} else {
						currentLearningStreak = 1;
					} 
				}
				dateLastActive = today;
			}
		},

		show: function() {
			profile = document.getElementById("profilePage");
			profile.style.visibility = "visible";
			profile.style.opacity = "1.0";
			ctx = document.getElementById("profileCanvas").getContext("2d");
			ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_WIDTH);
			
			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0);
				ctx.font = TITLE_FONT;
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.fillText("profile", SCREEN_WIDTH / 2, PROFILE_TITLE_POSY);
			};
			img.src = "assets/banner.png";

			// always start with the first medal
			medalPos = 0; 
			drawMedal(medalPos);
		}
	};
});