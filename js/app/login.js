/**
 * login.js
 *
 * This module takes care of the gui for the login, the code & connection checking happens
 * in session.js, which returns the status to login with the callback function 'checkLogin'
 * implemented in main.js module.
 *
 * If there is already a account code saved in the storage, then there will be no login interface
 * drawn. An account code will only be saved if it was correct code. So the user only has to login in
 * once.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData', 'popup'], function(userData, popup) {
	var canvas, ctx;
	var firstNumber = 0, 
	secondNumber = 0, 
	thirdNumber = 0, 
	fourthNumber = 0;
	var loginCode = 0;
		
	//definitions of screen variables
	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;
	
	//definitions of text variables
	var TITLE_HEIGHT = 70;
	var TITLE_TEXT_HEIGHT = 62;
	var ICON_HEIGHT = 15;
	var DIGIT_SPACE = 76;
	var DIGIT_HEIGHT = 105;
	var POS_FIRST_DIGIT = 40;
	var POS_DIGIT_LEFT = 65;
	var POS_DIGIT_TOP = 80;

	// title font
	var TITLE_FONT = "15px Arial";
	var TITLE_FONT_COLOR = "white";

	// code font
	var CODE_FONT = "80px Arial";
	var CODE_FONT_COLOR = "black";

	var NUMBER_OF_CODE_NUMBERS_ON_PAGE = 4;
	
	function goToMainPage(){
		document.getElementById("loginPage").style.display = "none";
		document.getElementById("mainPage").style.display = "block";
	}
	
	function printCodeNumber(position, number){
		ctx = document.getElementById("digitsCanvas").getContext("2d");

		ctx.clearRect(POS_FIRST_DIGIT + DIGIT_SPACE*position, 0, DIGIT_SPACE ,DIGIT_HEIGHT);
		ctx.font = CODE_FONT;
		ctx.fillStyle = CODE_FONT_COLOR;
		ctx.textAlign = "center";
		ctx.fillText(number, POS_DIGIT_LEFT + DIGIT_SPACE*position, POS_DIGIT_TOP);
	}
	
	function printNumber(position, adding, number){
		if (adding) {
			number++;
			if (number>9){
				number=0;
			}
		} else {
			number--;
			if (number<0){
				number=9;
			}
		}
		printCodeNumber(position, number);	
		return number;
	}
	
	function printTitle(){
		ctx = document.getElementById("loginHeaderCanvas").getContext("2d");
		ctx.clearRect(0, 0, SCREEN_WIDTH, TITLE_HEIGHT);
		
		ctx.font = TITLE_FONT;
		ctx.fillStyle = TITLE_FONT_COLOR;
		ctx.textAlign = "center";
		ctx.fillText("Please fill in your 8 digit code", SCREEN_WIDTH/2, TITLE_TEXT_HEIGHT);
	}
	
	function placePageIcon(page){
		ctx = document.getElementById("iconPageNrCanvas").getContext("2d");
		ctx.clearRect(0, 0, SCREEN_WIDTH, ICON_HEIGHT);
	
		if (page === 1) {
			ctx.beginPath();
			ctx.arc(170, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(190, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#C3C3C3";
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.arc(170, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#C3C3C3";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(190, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
		}
	}
	
	function printStartScreen(pageNr){
		printTitle();
		placePageIcon(pageNr);
		
		for (var i=0; i<NUMBER_OF_CODE_NUMBERS_ON_PAGE; i++) {
			printCodeNumber(i, 0);
		}
	}
	
	function resetCode(pageNr){
		firstNumber = 0;
		secondNumber = 0;
		thirdNumber = 0;
		fourthNumber = 0;
		if (pageNr === 1) {
			loginCode = 0;
		}
		printStartScreen(pageNr);
	}

	function updateFirstNumber(addition) {
		firstNumber = printNumber(0,addition, firstNumber);
	}

	function updateSecondNumber(addition) {
		secondNumber = printNumber(1,addition, secondNumber);
	}

	function updateThirdNumber(addition) {
		thirdNumber = printNumber(2,addition, thirdNumber);
	}

	function updateFourthNumber(addition) {
		fourthNumber = printNumber(3, addition, fourthNumber);
	}

	return function login(checkLogin) {

		// uncomment this line to skip login
		// localStorage.setItem("accountCode", 61015763);

		// only valid codes will be saved
		if (localStorage.getItem("accountCode") !== null) {
			userData.load();
			// no login screen needed, because user already entered code.
			goToMainPage();
			checkLogin(userData.getCode());
		} else {
			ctx = document.getElementById("digitsCanvas").getContext("2d");
			printStartScreen(1);
			
			document.getElementById("first_plus").addEventListener("click", function(){
				updateFirstNumber(true);
			});
			document.getElementById("first_min").addEventListener("click", function(){
				updateFirstNumber(false);
			});
			
			document.getElementById("second_plus").addEventListener("click", function(){
				updateSecondNumber(true);
			});
			document.getElementById("second_min").addEventListener("click", function(){
				updateSecondNumber(false);
			});
			
			document.getElementById("third_plus").addEventListener("click", function(){
				updateThirdNumber(true);
			});
			document.getElementById("third_min").addEventListener("click", function(){
				updateThirdNumber(false);
			});
			
			document.getElementById("fourth_plus").addEventListener("click", function(){
				updateFourthNumber(true);
			});
			document.getElementById("fourth_min").addEventListener("click", function(){
				updateFourthNumber(false);
			});
			
			document.getElementById("setNextButton").addEventListener("click", function(){
				if (loginCode===0) {
					loginCode = firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					resetCode(2);
				} else {
					loginCode = loginCode + firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					
					var status = checkLogin(loginCode);
					if (status === "SUCCESS") {
						userData.saveCode(loginCode);
						goToMainPage();
					} else {
						popup.forLogin(status, resetCode);
					}
				}
			});
			
		}
	};
});