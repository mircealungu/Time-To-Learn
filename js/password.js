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

function addToStorage(code){
	
	var key = "0";

    /* Set the local storage item */
    if ("localStorage" in window) 
    {
       localStorage.setItem(key, code);
       location.reload();
       console.log("saved locally: " + code);
    } 
    else 
    {
       alert("no localStorage in window");
    }
}

function retrieveCode(){
	var local = "";
  
	if(localStorage.length>0){
	    /* Get the local storage item */
	    for (var i = 0; i < localStorage.length; i++) 
	    {
	       //local += localStorage.key(i) + " : " + localStorage.getItem(localStorage.key(i));
	    	local += localStorage.getItem(localStorage.key(i));
	       console.log("retrieved from local: " + local);
	    }
	} else {
		return 0;
	}
    return local;
}

function listenerPassword() {
	var digits = 4;
	var insertedNumber = 0;
	var loginCode = 0;
	
	canvas = document.getElementById("digitSpace"); 
	ctx = canvas.getContext("2d");
	
	loginCode = retrieveCode();
	console.log("local logincode: " + loginCode);
	
	if(loginCode!==0){
		console.log("saved logincode: " + loginCode);
		var d1,d2;
		
		d1 = document.getElementById("login");
		d2 = document.getElementById("mainPage");
		   
		d1.style.display = "none";
		d2.style.display = "block";
	}
	
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
				addToStorage(insertedNumber);
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

}