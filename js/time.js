function getTime() {
	var date = getTizenDateTime();
	var year = date.getFullYear();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	if(hours<10) {
		hours = "0" + hours;
	}
	if(minutes<10){
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return year+"-"+month+"-"+day+"T"+hours+":"+minutes+":"+seconds;
}

function getTizenDateTime(){
	var date;
	try {
		date = tizen.time.getCurrentDateTime();
	} catch (err) {
		console.error('Error: ', err.message);
	}
	return date;
}