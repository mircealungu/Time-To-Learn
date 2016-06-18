/**
 * login.js
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(['userData'], function(userData) {
	var canvas, ctx;
	
	function erasePasswordDigits(){
		ctx.clearRect(0,0, 360, 110);
		return 0;
	}

	function printPasswordDigit(number, digits){
		ctx.font = "50px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(number, 270 - (digits-1)*60, 90);
	}

	function passwordButtonPressed(number, digits, inNumber){
		if (digits>0){
			inNumber = inNumber + number * Math.pow(10,digits-1);
			printPasswordDigit(number, digits);
			console.log("inserted number: " + inNumber);
		}
		return inNumber;
	}

	function accountCode(){
		var code = 1234;
		return code;
	}

	return function login() {
		var digits = 4;
		var insertedNumber = 0;
		var loginCode = 0;

		userData.load();

		canvas = document.getElementById("digitSpace"); 
		ctx = canvas.getContext("2d");

		loginCode = userData.getCode();
		console.log("local logincode: " + loginCode);

		document.getElementById("oneButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("1", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("twoButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("2", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("threeButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("3", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("fourButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("4", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("fiveButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("5", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("sixButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("6", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("sevenButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("7", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("eightButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("8", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("nineButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("9", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("zeroButton").addEventListener("click", function(){
			insertedNumber = passwordButtonPressed("0", digits, insertedNumber);
			digits = digits - 1;
		});
		document.getElementById("deleteButton").addEventListener("click", function(){
			insertedNumber = erasePasswordDigits();
			digits = 4;
		});

		document.getElementById("okayButton").addEventListener("click", function(){
			if (digits===0){
				if (insertedNumber===accountCode()){
					userData.setCode(insertedNumber);
					var d1,d2;

					d1 = document.getElementById("login");
					d2 = document.getElementById("mainPage");

					d1.style.display = "none";
					d2.style.display = "block";
				}else{
					insertedNumber = erasePasswordDigits();
					digits = 4;
				}
			}
		});
	};
});