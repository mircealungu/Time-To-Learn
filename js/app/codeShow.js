/**
 * codeShow.js
 *
 * This module implements the code show page, which can be accessed by the settings menu. It
 * implements showing the code for connection with the account on the server.
 * If you double tap the screen, the manner of showing the code switches between numbers and a QR Code
 * This is implemented in a way that the qrcode is created only once. This is more efficient. After
 * the page is loaded once, we can easily access the page, since everything is already initialized.
 * 
 * made by Robin Sommer
 */

define(['userData', 'qrcode'], function(userData, qrcode) {
	var TEXTUAL_PAGE = 1;
	var QRCODE_PAGE = 2;
	var page = TEXTUAL_PAGE;
	var ctx;
	var QRcode;
	var numbersPrinted = false;
	var qrCodePrinted = false;
	
	//definitions of screen variables
	var SCREEN_WIDTH = 360;
	var SCREEN_HEIGHT = 360;
	
	//definitions of text variables
	var TITLE_HEIGHT = 70,TITLE_TEXT_HEIGHT = 62;
	var MESSAGE_HEIGHT = 20, MESSAGE_TEXT_HEIGHT=15;
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

/*	The function showPage operates what is show on the canvas. The page which should be shown is handed as a parameter. The
 *	page can be textual (the code in digits), as well as a qr code.
 */
	function showPage(page) {
		if (page === TEXTUAL_PAGE) {
			document.getElementById("qrcode").style.display = "none";
			document.getElementById("codeShowDigits").style.display = "block";
			// TEXTUAL_PAGE, so message = double tap for QR Code
			printMessage("Double tap for QR Code");
		} else {
			document.getElementById("codeShowDigits").style.display = "none";
			document.getElementById("qrcode").style.display = "block";
			// TEXTUAL_PAGE, so message = double tap for code in digits
			printMessage("Double tap for code in digits");
		}
	}
	
/*	The function printCodeNumber prints the 8 digit session number to the canvas. The 8 digit number is printed in two
 *	sequenes of 4 digits, one beneath another.
 */
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
	
/*	The function printTitle prints "Your 8 digit code:" at the top of the screen. */
	function printTitle(){
		ctx = document.getElementById("codeShowHeaderCanvas").getContext("2d");
		ctx.clearRect(0, 0, SCREEN_WIDTH, TITLE_HEIGHT);
		
		ctx.font = TITLE_FONT;
		ctx.fillStyle = TITLE_FONT_COLOR;
		ctx.textAlign = "center";
		ctx.fillText("Your 8 digit code:", SCREEN_WIDTH/2, TITLE_TEXT_HEIGHT);
	}
	
/*	The function printMessage prints a given message on the screen just above the backButton. This message
 *	is to inform the user about the switching between the two pages.
 */
	function printMessage(message) {
		ctx = document.getElementById("codeShowMessageCanvas").getContext("2d");
		ctx.clearRect(0, 0, SCREEN_WIDTH, TITLE_HEIGHT);
		ctx.clearRect(0, 280, SCREEN_WIDTH, MESSAGE_HEIGHT);
		
		ctx.font = TITLE_FONT;
		ctx.fillStyle = TITLE_FONT_COLOR;
		ctx.textAlign = "center";
		ctx.fillText(message, SCREEN_WIDTH/2, MESSAGE_TEXT_HEIGHT);
	}
	
/*	The function initDigits will print the 8 digits on the digitCanvas. */
	function initDigits() {
		var accountCode = userData.getCode();
		//		print code in numbers here
		var digitToShow;
		for (var i = 0; i < NUMBER_OF_CODE_NUMBERS_ON_PAGE ; i++) {
			digitToShow = Math.floor(accountCode / Math.pow(10,7-i));
			digitToShow = digitToShow - (Math.floor(digitToShow / 10) * 10);
			printCodeNumber(i,digitToShow);
		}
		numbersPrinted = true;
	}
	
/*	The function initQRCode will create a QR Code and will store this QR Code in "imageQR". The QRCode is only rendered once. */
	function initQRCode() {
		var accountCode = userData.getCode();
		//		create QR Code here
		QRcode = new QRCode("imageQR", {
		    text: accountCode.toString(),
		    width: 200,
		    height: 200,
		    colorDark : "#000000",
		    colorLight : "#ffffff",
		});
		qrCodePrinted = true;
	}

/*	The function InitPage will initialize all the sections of the page. */
	function initPage() {
		document.getElementById("mainPage").style.display = "none";
		document.getElementById("codeShowPage").style.display = "block";
		document.getElementById("backButtonInCodeShow").addEventListener("click", function(){
			document.getElementById("codeShowPage").style.display = "none";
			document.getElementById("mainPage").style.display = "block";
		});
		
		if (!numbersPrinted) { initDigits(); }
		printTitle();
		showPage(TEXTUAL_PAGE);
		// QR code is loaded when the TEXTUAL_PAGE is shown. This should minimize the waiting time for the user when switching to the QRCODE_PAGE
		if (!qrCodePrinted) { initQRCode(); }
	}

	return {
		show: function() {
			initPage();
		},
	
		changePage: function() {
			page = (page === TEXTUAL_PAGE? QRCODE_PAGE : TEXTUAL_PAGE);
			showPage(page);
		}
	};
});