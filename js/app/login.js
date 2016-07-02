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
	
	function checkSavedCode(){
		userData.load();
		console.log("local logincode: " + userData.getCode());
		return userData.getCode();
	}
	
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
		
		ctx.clearRect(40 + 75*(position-1), 0, 75 ,105);
		ctx.font = "80px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(number, 65 + 75*(position-1), 80);
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
	
	function printTitle(){
		canvas = document.getElementById("log_headerSpace");
		ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,360,70);
		
		ctx.font = "30px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Time to Learn", 180, 43);
		
		ctx.font = "15px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Please fill in your 8 digit code", 180, 62);
	}
	
	function placePageIcon(page){
		canvas = document.getElementById("pageIconSpace");
		ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,360,15);
		
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

	return function login(loginSucces) {

		if (checkSavedCode()!==0) {
			// no login screen needed, because user already entered code.
			goToMainPage();
			loginSucces();
		}else{
			canvas = document.getElementById("digitSpace"); 
			ctx = canvas.getContext("2d");
			printStartScreen(1);
			
			document.getElementById("first_plus").addEventListener("click", function(){
				firstNumber = printNumber(1,true, firstNumber);
			});
			document.getElementById("first_min").addEventListener("click", function(){
				firstNumber = printNumber(1,false, firstNumber);
			});
			
			document.getElementById("second_plus").addEventListener("click", function(){
				secondNumber = printNumber(2,true, secondNumber);
			});
			document.getElementById("second_min").addEventListener("click", function(){
				secondNumber = printNumber(2,false, secondNumber);
			});
			
			document.getElementById("third_plus").addEventListener("click", function(){
				thirdNumber = printNumber(3,true, thirdNumber);
			});
			document.getElementById("third_min").addEventListener("click", function(){
				thirdNumber = printNumber(3,false, thirdNumber);
			});
			
			document.getElementById("fourth_plus").addEventListener("click", function(){
				fourthNumber = printNumber(4,true, fourthNumber);
			});
			document.getElementById("fourth_min").addEventListener("click", function(){
				fourthNumber = printNumber(4,false, fourthNumber);
			});
			
			document.getElementById("setNextButton").addEventListener("click", function(){
				if(loginCode===0){
					loginCode = firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					resetCode(2);
				}else{
					loginCode = loginCode + firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString();
					userData.setCode(parseInt(loginCode, 10));
					goToMainPage();
					loginSucces();
					//we dont check whether the login was correct, any code can go to the main, but only 
					//correct codes will give you the words
				}
			});
			
		}
	};
});