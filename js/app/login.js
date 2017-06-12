/**
 * login.js
 *
 * This module takes care of the gui for the login, the code & connection checking happens
 * in session.js, which returns the status to login with the callback function 'checkLogin'
 * implemented in main.js module.
 *
 * If the user uses the app for the first time, an anonymous account is created and a session is
 * fetched. Also there is gui, which shows the languages available to learn. If there is already
 * an account code saved in the storage, then there will be no login interface drawn. An account
 * code will only be saved if it was a correct code. So the user only has to login once.    

 * made by Yaroslav Tykhonchuk, Nick Borchers and Robin Sommer
 */

define(['userData', 'popup'], function(userData, popup) {
    var ctx;
    var loginCode = 0;

    //Definition of login endpoints:
	const RELOGIN_ENDPOINT = "https://zeeguu.unibe.ch/api/get_anon_session/";
	const GET_ANONYMOUS_ACCOUNT_ENDPOINT = "https://zeeguu.unibe.ch/api/add_anon_user";
	
	// Definition of country code constants
	const NETHERLANDS = "nl";
	const GERMANY = "de";
	const SPAIN = "es";
	const FRANCE = "fr";
	
	// Definition of connection messages:
	const WRONG_SESSION_NUMBER = "WRONG_SESSION_NUMBER";
	const NO_CONNECTION = "NO_CONNECTION";
	
    //definitions of screen variables
    var SCREEN_WIDTH = 360;
    var SCREEN_HEIGHT = 360;

    var NUMBER_OF_CODE_NUMBERS_ON_PAGE = 4;
     
    var available_languages = getAvailableLanguages();
//    var available_languages = ["fr","de","es","nl","es","nl"];
   /*
     * goToMainPage() sets the right html "<div>" to display. 
     * The drawing of other elements is done by other functions.
     */
    
    function goToMainPage() {
        document.getElementById("languageFlags").style.display="none";
        document.getElementById("mainPage").style.display = "block";
    }
    
    /* 
     * selectLanguages() handles flag presses from the selectLanguage menu. 
     * The corresponding country is passed on to the requestAnonAccount() function. 
     */
    function selectLanguages(checkLogin) {
    	//getAvailableLanguages();    init the available_languages array
    	initLanguages();
    	console.log(available_languages.toString());
    	selectNextLanguageScreens();
    	
    	var flags = document.getElementsByClassName("flagButton");
    	var getLanguageName = function() {

    		var langName = this.getAttribute("id").substring(0,2);   // will return 2 first letters of language ("fr","gr"..)

    		requestAnonAccount(langName);
    		if( userData.getCode() !== 0 ){
    			goToMainPage();
    			checkLogin(userData.getCode());
    		}else{
    			selectLanguages();
    		}
    	};
    	for(var i=0;i<flags.length;i++){
    		flags[i].addEventListener('click', getLanguageName, false);
    	}

    }
    
    // dynamically add available languages to the screen
    function initLanguages(){
    	
    	var indexOfBlocks=1,positionIndex=1;
    	
    	// create blocks of Flags each contains from 1 to 4 flags
    	for (var i=1; i<available_languages.length+1; i++) {
    		if (i>4 && (i-1) % 4 == 0) {
    			indexOfBlocks++;
    			var blockDiv = document.createElement('div');
        		blockDiv.id = indexOfBlocks+'BlockOfFlags';
        		blockDiv.style.display='none';
        		document.getElementById("languageFlags").appendChild(blockDiv);
    		}
    		
    		var flagDiv = document.createElement('div');
    		flagDiv.className='flagButton';
    		flagDiv.id=available_languages[i-1]+"Flag";
    		selectPositionForFlag(flagDiv,positionIndex);    		
    		positionIndex++;
    		if (positionIndex>4) positionIndex=1;
    		
    		document.getElementById(indexOfBlocks+"BlockOfFlags").appendChild(flagDiv);
    	}
    }
    
	// set position of each flag on the screen 
    function selectPositionForFlag(langDiv,index){
    	switch(index) {
        case 1:
    		langDiv.style.top="70px";
    		langDiv.style.left="60px";
            break;
        case 2:
    		langDiv.style.top="70px";
    		langDiv.style.left="188px";
            break;
        case 3:
    		langDiv.style.top="189px";
    		langDiv.style.left="60px";
        	break;
        case 4:
    		langDiv.style.top="189px";
    		langDiv.style.left="188px";
        	break;
        default:
        	console.log("WEIRD INDEX FOUND");
        }
    }
  
    // click function on the "back" and "next" buttons
    function selectNextLanguageScreens(){
    	
    	var languageFlagsDiv=document.getElementById("languageFlags");
    	var numberOfBlocks = languageFlagsDiv.childElementCount-2;
    	var index=1;
    
    	checkIfDisplayNextBackButton(index,numberOfBlocks);
 
    	document.getElementById("nextLangButton").addEventListener("click",function(){   		
    		document.getElementById(index+"BlockOfFlags").style.display="none";
    		index++;
    		document.getElementById(index+"BlockOfFlags").style.display="block";
    		checkIfDisplayNextBackButton(index,numberOfBlocks);
    	});
    	
    	document.getElementById("backLangButton").addEventListener("click",function(){
    		
    		document.getElementById(index+"BlockOfFlags").style.display="none";
    		index--;
    		document.getElementById(index+"BlockOfFlags").style.display="block";
    		
    		checkIfDisplayNextBackButton(index,numberOfBlocks);
    	});
    }
    
    // check whether display the "back" and "next" buttons 
    function checkIfDisplayNextBackButton(index,numberOfBlocks){
    	
    	if(numberOfBlocks>1 && index<numberOfBlocks){
    		document.getElementById("nextLangButton").style.display="block";
    	} else {
    		document.getElementById("nextLangButton").style.display="none";
    	}
    	
    	if(numberOfBlocks>1 && index>1){
    		document.getElementById("backLangButton").style.display="block";
    	} else {
    		document.getElementById("backLangButton").style.display="none";    		
    	}
    }
        
    function setLearnedLanguage(session, language){
    	const SET_LEARNED_LANGUAGE_ENDPOINT = "https://zeeguu.unibe.ch/api/learned_language/";
    	try {
    	    var xhr = new XMLHttpRequest();
    	    xhr.open('POST',  SET_LEARNED_LANGUAGE_ENDPOINT + language + "?session=" + session, true);
    	    xhr.onload = function () {
    	        try {
    	            console.log(this.responseText); //no need for parsing, response should be "OK"
    	        } catch(err) {
    	            // Invalid request
    	            console.log("INVALID_REQUEST");
    	        }
    	    };
    	    xhr.send();
    	} catch(err) {
    	    // there is no internet connection
    	    console.log("NO_CONNECTION");
    	}   
    }

    	function setAvailableLanguages(av_lang){
    	    available_languages = av_lang;
    	}

    	function getAvailableLanguages() {
    	    const GET_LANGUAGES_ENDPOINT = "https://zeeguu.unibe.ch/api/available_languages";
    	    try { 
    	        var xhr = new XMLHttpRequest();
    	        xhr.open('GET', GET_LANGUAGES_ENDPOINT, false);
    	        xhr.onload = function () {
    	            try {
//    	                setAvailableLanguages(JSON.parse(this.responseText));
    	                localStorage.setItem("availableLanguages", JSON.parse(this.responseText));
    	                console.log(JSON.parse(this.responseText));
    	            } catch(err) {
    	                // Invalid request
    	                console.log("INVALID_REQUEST");
    	            }
    	        };
    	        xhr.send();
    	    } catch(err) {
    	        // there is no internet connection
    	        console.log("NO_CONNECTION");
    	    }
    	   return localStorage.getItem("availableLanguages");
    	}

    /*
     * guid() generates a (nearly) random UUID. It is not hardware based, we need system calls for this which turned out to be quite tricky.
     * Therefore it just generates a very large random string. In the rare occasion that two (globally, known to the server)
     * identical strings are generated, we simply try again.
     */
    function guid() {
    	  function s4() {
    	    return Math.floor((1 + Math.random()) * 0x10000)
    	      .toString(16)
    	      .substring(1);
    	  }
    	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    	    s4() + '-' + s4() + s4() + s4();
    	}

/* randPass() generates a number between 1 and 1 million. Which is used as a password for the random account. */
	function randPass() {
		return (Math.floor((1 + Math.random() * 1000000))).toString();
	}
    	
	/* requestAnonAccount() gets a string containing the desired language to be learned. This function generates a random UUID ans password combination 
	 * which is then being stored inside localStorage for subsequent logins. The server returns a session which can be used for further requests for the server.
	 */
	function requestAnonAccount(learning_language) {
		var uuid = guid();
		var password = randPass();
	    var form = new FormData();
		form.append('uuid', uuid);
		form.append('password', password);
		form.append('learned_language_code', learning_language);
		form.append('native_language_code', "en");
	    try { 
			var xhr = new XMLHttpRequest();
			xhr.open('POST', GET_ANONYMOUS_ACCOUNT_ENDPOINT, false);
			xhr.onload = function () {
				try {
					userData.saveCode(JSON.parse(this.responseText));
					userData.saveUuid(uuid);
					userData.savePassword(password);
					setLearnedLanguage(JSON.parse(this.responseText),learning_language);
				} catch(err) {
				// UUID and Password combination are invalid.
				console.log(WRONG_SESSION_NUMBER);
				}
			};
			// xht.send(form) here ??
			xhr.send(form);
		} catch(err) {
			// there is no internet connection
			console.log(NO_CONNECTION);
		}
		console.log("new account: uuid == " + userData.getUuid("uuid"));
		console.log("new account: password == " + userData.getPassword("password"));
		console.log("new account: accountcode == " + userData.getCode("accountCode"));
	}
    
	/*
	 * relogin is being called when uuid and password are present in localstorage. We are 100% sure that 
	 * this combination should then ring a bell with the server; they are only stored when the server has accepted them before.
	 * In the unusual event that this is not the case, the selectLanguage page is loaded and a new anonynous account can then be 
	 * created for the user.
	 */
	function relogin(uuid, password) {
		var form = new FormData();
		form.append('password', password);
	    try { 
			var xhr = new XMLHttpRequest();
			xhr.open('POST', RELOGIN_ENDPOINT + uuid, false);
			xhr.onload = function () {
				try {
					userData.saveCode(JSON.parse(this.responseText));
				} catch(err) {
				// UUID and Password combination are invalid.
				console.log(WRONG_SESSION_NUMBER);
				}
			};
			xhr.send(form);
		} catch(err) {
			// there is no internet connection
			console.log(NO_CONNECTION);
		}
	}
    	
    /*
     * login handles everything that corresponds with the login functionality: the core logic is implemented here.
     * As you can see, there are two lines which can be uncommented to demonstrate both cases: when an account is present
     * and when this is not the case.
     */
    return function login(checkLogin) {
		/* Old part which works */

    	/*localStorage.setItem("accountCode", "59961147");
    	userData.load();
		goToMainPage();
		checkLogin(userData.getCode());
		return;*/

		/* Old part which works */

		
    	/* New part */
		
    	localStorage.clear();
    	
    	// Uncomment the following two lines to test all code below: (Account learning german)
//    	userData.saveUuid("d615d7ff-9895-aab8-cb45-a14da23f7ca3");
//    	userData.savePassword("17196");
//		userData.saveCode("59961147"); // account of Niek (or the other guy)
       	
		if ( (userData.getUuid() !== null) && (userData.getPassword() !== null) ) {
			relogin(userData.getUuid(), userData.getPassword());    			
			if( userData.getCode() !== 0 ) {
				goToMainPage();
				checkLogin(userData.getCode());
			} else {
				selectLanguages(checkLogin);
    		}
    	} else {
    		selectLanguages(checkLogin);
    	}
    }
});