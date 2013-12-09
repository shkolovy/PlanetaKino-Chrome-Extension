var planetaKinoExtCheckInterval = setInterval(function(){
	if($.cookie(window.cookiesKeys.isVisited) == window.planetaKinoExt.settings.checkDate){
		clearInterval(planetaKinoExtCheckInterval);
	}
	else{
		window.planetaKinoExt.checkAndNotify();
	}
}, window.planetaKinoExt.settings.checkInterval);