/**
 * weather.js
 *
 * This module takes care of drawing the weather and temperature. The sunset and sunrise
 * are used in gui.js to draw the rotating background. The weather will be refreshed on every
 * screenOn event.
 *
 * made by Rick Nienhuis & Niels Haan
 */

define(function() {

	var APP_ID = "ab2771b4d49ab0798786dd6f2bee71a0";
	var weather = null;
	var isRefreshed = false;
	var ctxWeather, ctxTemp;

	// definitions
	var WEATHER_SPACE = 50;
	var TEMPERATURE_SPACE = 50;
	var TEMPERATURE_POS = 25;
	var TEMPERATURE_FONT = "17px Arial";
	var TEMPERATURE_COLOR = "white";

	function getWeather(lat, lon) {
		try {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + APP_ID, false);
			xhr.onload = function() {
				weather = JSON.parse(this.responseText);
				// Save weather if there is no connection later for sunset and sunrise.
				localStorage.setItem("weather", JSON.stringify(weather));					
			};
			xhr.send();
		} catch (err) {
			isRefreshed = false;
		}
	}

	function getLocation() {
		var xhr = new XMLHttpRequest();
		try {
			xhr.open('GET', 'http://ip-api.com/json', false);
			xhr.onload = function() {
				var data = JSON.parse(this.responseText);
				getWeather(data.lat, data.lon);
			};
			xhr.send();
		} catch (err) {
			isRefreshed = false;
		}

	}
	
	function convertEpochTime(seconds) {
		var date = new Date(seconds * 1000);
		return date.getUTCHours() * 60 + date.getUTCMinutes() - date.getTimezoneOffset();
	}

	function getTemperature() {
		return (weather.main.temp - 273.15).toFixed(0);
	}

	return {

		create: function() {
			ctxWeather = document.getElementById("weatherCanvas").getContext("2d");
			ctxTemp = document.getElementById("temperatureCanvas").getContext("2d");
		},

		refresh: function() {
			isRefreshed = true;
			getLocation();
			if (weather===null) {
				weather = JSON.parse(localStorage.getItem("weather"));
			}
		},

		getSunset: function() { 
			return convertEpochTime(weather.sys.sunset);
		},

		getSunrise: function() {
			return convertEpochTime(weather.sys.sunrise);
		},

		draw: function() {
			if (isRefreshed) {
				isRefreshed = false;
				
				var img = new Image();
				ctxWeather.clearRect(0, 0, WEATHER_SPACE, WEATHER_SPACE);
				img.onload = function() {
					ctxWeather.drawImage(img, 0, 0);
				};
				img.src = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";

				ctxTemp.clearRect(0,0,TEMPERATURE_SPACE,TEMPERATURE_SPACE);
				ctxTemp.font = TEMPERATURE_FONT;
				ctxTemp.fillStyle = TEMPERATURE_COLOR;
				ctxTemp.textAlign = "center";
				ctxTemp.fillText(getTemperature() + "°C", TEMPERATURE_POS, TEMPERATURE_POS);
			}
		}
	};

});