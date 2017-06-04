/**
 * codeShow.js
 *
 * This module implements showing the code for connection with the account on the server.
 * if you double tap the screen, the manner of showing the code switches between numbers and a QR Code
 * 
 * made by Robin Sommer
 */

define(['userData', 'qrcode'], function(userData, qrcode) {
	var page = 1;
	var TEXTUAL_PAGE = 1;
	var QRCODE_PAGE = 2;
	var ctx;
	var QRcode;
	var numbersPrinted = false;
	var qrCodePrinted = false;
	
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
	var CODE_FONT_COLOR = "white";

	var NUMBER_OF_CODE_NUMBERS_ON_PAGE = 8;

	function printMessage(page) {
		var canvasCodeShow = document.getElementById("codeShowMessageCanvas").getContext("2d");
//		if (page === TEXTUAL_PAGE) {
		canvasCodeShow.clearRect(0, 0, SCREEN_WIDTH, 20);
			
		canvasCodeShow.font = TITLE_FONT;
		canvasCodeShow.fillStyle = TITLE_FONT_COLOR;
		canvasCodeShow.textAlign = "center";
		canvasCodeShow.fillText("double tap", SCREEN_WIDTH/2, 290);
//		} else {
//			
//		}
	}
	
	function printCodeNumber(position, number){
		ctx = document.getElementById("codeShowDigitsCanvas").getContext("2d");

		if (position < 4) {
			ctx.clearRect(POS_FIRST_DIGIT + DIGIT_SPACE*position, 0, DIGIT_SPACE ,DIGIT_HEIGHT);
			ctx.font = CODE_FONT;
			ctx.fillStyle = CODE_FONT_COLOR;
			ctx.textAlign = "center";
			ctx.fillText(number, POS_DIGIT_LEFT + DIGIT_SPACE*position, POS_DIGIT_TOP);
		} else {
//			Second four digits beneath first four digits
			ctx.clearRect(POS_FIRST_DIGIT + DIGIT_SPACE*(position-4), DIGIT_HEIGHT, DIGIT_SPACE ,DIGIT_HEIGHT);
			ctx.font = CODE_FONT;
			ctx.fillStyle = CODE_FONT_COLOR;
			ctx.textAlign = "center";
			ctx.fillText(number, POS_DIGIT_LEFT + DIGIT_SPACE*(position-4), POS_DIGIT_TOP+DIGIT_HEIGHT);
		}
	}
	
	function printTitle(title, canvas){
		ctx = document.getElementById(canvas).getContext("2d");
		ctx.clearRect(0, 0, SCREEN_WIDTH, TITLE_HEIGHT);
		
		ctx.font = TITLE_FONT;
		ctx.fillStyle = TITLE_FONT_COLOR;
		ctx.textAlign = "center";
		ctx.fillText(title, SCREEN_WIDTH/2, TITLE_TEXT_HEIGHT);
	}

	function initDigits() {

		var accountCode = userData.getCode();
		numbersPrinted = true;
		//		print code in numbers here
		var digitToShow;
		for (var i = 0; i < NUMBER_OF_CODE_NUMBERS_ON_PAGE ; i++) {
			digitToShow = Math.floor(accountCode / Math.pow(10,7-i));
			digitToShow = digitToShow - (Math.floor(digitToShow / 10) * 10);
			printCodeNumber(i,digitToShow);
		}
	}
	
	function initQRCode() {
		var accountCode = userData.getCode();

		//		create QR Code here
		qrCodePrinted = true;
		QRcode = new QRCode("imageQR", {
		    text: accountCode.toString(),
		    width: 200,
		    height: 200,
		    colorDark : "#000000",
		    colorLight : "#ffffff",
		});
	}

	function initPage() {
		document.getElementById("mainPage").style.display = "none";
		document.getElementById("codeShowPage").style.display = "block";
		if (!numbersPrinted) { initDigits(); }
		if (!qrCodePrinted) { initQRCode(); }
		printTitle("Your 8 digit code:", "codeShowHeaderCanvas");
		printMessage(TEXTUAL_PAGE);
	}

	function swapPage() {
		if (page === TEXTUAL_PAGE) {
			document.getElementById("qrcode").style.display = "none";
			document.getElementById("codeShowDigits").style.display = "block";
		} else {
			document.getElementById("codeShowDigits").style.display = "none";
			document.getElementById("qrcode").style.display = "block";
		}
//		placePageIcon(page);
	}
	
	return {
		show: function() {
			initPage();
			document.getElementById("backButtonInCodeShow").addEventListener("click", function(){
				document.getElementById("codeShowPage").style.display = "none";
				document.getElementById("mainPage").style.display = "block";
			});
		},
	
		changePage: function() {
			page = (page === TEXTUAL_PAGE? QRCODE_PAGE : TEXTUAL_PAGE);
			swapPage(page);
		}
	};
});