/**
 * login.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData'], function(userData) {
	var canvas, ctx;
	var firstNumber = 0, 
	secondNumber = 0, 
	thirdNumber = 0, 
	fourthNumber = 0;
	var loginCode = 0;
		
	//definitions of screen variables
	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;
	var SCREEN_MIDDLE = 180;
	
	//definitions of text variables
	var TITLE_HEIGHT = 70;
	var TITLE_TEXT_HEIGHT = 62;
	var ICON_HEIGHT = 15;
	var DIGIT_SPACE = 76;
	var DIGIT_HEIGHT = 105;
	var POS_FIRST_DIGIT = 40;
	var POS_DIGIT_LEFT = 65;
	var POS_DIGIT_TOP = 80;
	var POPUP_TEXT_HEIGHT_1 = 120;
	var POPUP_TEXT_HEIGHT_2 = 155;
	var POPUP_TEXT_HEIGHT_3 = 185;
	var POPUP_TEXT_HEIGHT_4 = 215;
	var POPUP_TEXT_HEIGHT_5 = 245;
	var POPUP_TEXT_HEIGHT_6 = 280;
	
	function goToMainPage(){
		var canvasLogin,canvasMainPage;

		canvasLogin = document.getElementById("loginPage");
		canvasMainPage = document.getElementById("mainPage");

		canvasLogin.style.display = "none";
		canvasMainPage.style.display = "block";
	}
	
	function printPasswordNumber(position, number){
		canvas = document.getElementById("digitSpace");
		ctx = canvas.getContext("2d");
		
		ctx.clearRect(POS_FIRST_DIGIT + DIGIT_SPACE*(position-1), 0, DIGIT_SPACE ,DIGIT_HEIGHT);
		ctx.font = "80px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(number, POS_DIGIT_LEFT + DIGIT_SPACE*(position-1), POS_DIGIT_TOP);
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
		printPasswordNumber(position, number);	
		return number;
	}
	
	function showPopup(version) {
		canvas = document.getElementById("loginPopup");
		canvas.style.visibility = "visible";
		canvas = document.getElementById("loginPopupSpace");
		ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		
		ctx.font = "30px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		
		if (version === "NO_CONNECTION") {
			ctx.fillText("NO CONNECTION", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_1);
			ctx.fillText("There isn't a connection", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_2);
			ctx.fillText("with the internet", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_3);
			ctx.fillText("please check", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_4);
			ctx.fillText("your internet connection", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_5);
		} else if (version === "WRONG_SESSION_NUMBER") {
			ctx.fillText("WRONG PASSWORD", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_1);
			ctx.fillText("this password is not", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_2);
			ctx.fillText("recognized in our database", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_3);
			ctx.fillText("please check your account", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_4);
			ctx.fillText("at Zeeguu", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_5);
		} else {
			ctx.fillText("TOO FEW WORDS", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_1);
			ctx.fillText("more words needed", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_2);
			ctx.fillText("please make sure you have", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_3);
			ctx.fillText("at least 10 words", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_4);
		}
		
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("please press the screen to try again", SCREEN_MIDDLE, POPUP_TEXT_HEIGHT_6);
		
		resetCode(1);
		
		document.getElementById("loginPopup").addEventListener("click", function(){
			var canvas = document.getElementById("loginPopup");
			canvas.style.visibility = "hidden";
		});
	}
	
	function printTitle(){
		canvas = document.getElementById("log_headerSpace");
		ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,SCREEN_WIDTH,TITLE_HEIGHT);
		
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Please fill in your 8 digit code", SCREEN_MIDDLE, TITLE_TEXT_HEIGHT);
	}
	
	function placePageIcon(page){
		canvas = document.getElementById("pageIconSpace");
		ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,SCREEN_WIDTH,ICON_HEIGHT);
		
		if(page===1){
			ctx.beginPath();
			ctx.arc(170, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(190, 7, 7, 0, 2 * Math.PI);
			ctx.fillStyle = "#C3C3C3";
			ctx.fill();
		}else{
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
		
		printPasswordNumber(1, 0);
		printPasswordNumber(2, 0);
		printPasswordNumber(3, 0);
		printPasswordNumber(4, 0);
	}
	
	function resetCode(pageNr){
		firstNumber = 0;
		secondNumber = 0;
		thirdNumber = 0;
		fourthNumber = 0;
		if (pageNr===1){
			loginCode = 0;
		}
		printStartScreen(pageNr);
	}

	function updateFirstNumber(addition) {
		firstNumber = printNumber(1,addition, firstNumber);
	}

	function updateSecondNumber(addition) {
		secondNumber = printNumber(2,addition, secondNumber);
	}

	function updateThirdNumber(addition) {
		thirdNumber = printNumber(3,addition, thirdNumber);
	}

	function updateFourthNumber(addition) {
		fourthNumber = printNumber(4, addition, fourthNumber);
	}

	return function login(checkLogin) {

		// only valid codes will be saved
		if (localStorage.getItem("accountCode")!== null) {
			userData.load();
			// no login screen needed, because user already entered code.
			goToMainPage();
			checkLogin(userData.getCode());
		}else{
			
			canvas = document.getElementById("digitSpace"); 
			ctx = canvas.getContext("2d");
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
				if(loginCode===0){
					loginCode = firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					resetCode(2);
				}else{
					loginCode = loginCode + firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					
					var status = checkLogin(loginCode);
					if(status === "SUCCESS") {
						userData.saveCode(loginCode);
						goToMainPage();
					} else {
						showPopup(status);
					}
				}
			});
			
		}
	};
});