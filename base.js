var isNotificationOpened = false;
var isAudioPlayed = false;

var cookiesKeys = {
    isNotified: 'planetaKinoExtNotified',
    isVisited: 'planetaKinoExtVisited'
};
//var audio = new Audio('alert.mp3');

var planetaKinoExt = {
	audio: new Audio('alert.mp3'),
	self: this,
	settings: {
		checkInterval: 3000,
		checkDate: '2013-12-21',
		showNotification: true,
		audio: true,
		url: 'http://planeta-kino.com.ua/showtimes'
	},
	showPopup: function(){
		this._requestPage(this._displayPopupContent);
	},
	checkAndNotify: function(){
		planetaKinoExt._requestPage(function(e){
			if(planetaKinoExt._cropTicketContent(e.target.responseText).length > 0){
				planetaKinoExt._setBadge();

				if(planetaKinoExt.settings.showNotification && $.cookie(cookiesKeys.isNotified) != planetaKinoExt.settings.checkDate){
                    planetaKinoExt._showNotification();
				}

				if(planetaKinoExt.settings.audio && $.cookie(cookiesKeys.isNotified) != this.settings.checkDate){
					planetaKinoExt._startSound();
				}

                $.cookie(cookiesKeys.isNotified, planetaKinoExt.settings.checkDate, { expires: 7 })
			}
		});
	},
	_setBadge: function(){
		chrome.browserAction.setBadgeText({text: '!'});
	},
	_clearBadge: function(){
		chrome.browserAction.setBadgeText({text: ''});
	},
	_requestPage: function(callback){
		var req = new XMLHttpRequest();
	    req.open("GET", this._getFullUrl(), true);
	    req.onload = callback.bind(this);
	    req.send(null);
	},
	_showNotification: function(){
		var havePermission = window.webkitNotifications.checkPermission();

		if (havePermission == 0) {
			if(!isNotificationOpened){
				var notification = window.webkitNotifications.createNotification(
					'notification-icon.png',
					'Tickets!',
					'Бери пока не поздно'
				);

				notification.onclose = function(){
					isNotificationOpened = false;
				}

				notification.onshow = function(){
					isNotificationOpened = true;
				}

				notification.onclick = function () {
					window.open(planetaKinoExt._getFullUrl());
					notification.close();
				};

				isNotificationOpened = true;
				notification.show();
			}
		}
		else {
			window.webkitNotifications.requestPermission();
		}
	},
	_getFullUrl: function(){
		return this.settings.url + '/' + this.settings.checkDate;
	},
	_cropTicketContent: function(pageContent){
		return $(pageContent).find('.showtimes-row').html();
	},
	_displayPopupContent: function(e){
		var ticketContent = this._cropTicketContent(e.target.responseText);
		$('body').html(ticketContent || 'no tickets :(');

		if(ticketContent){
			this._clearBadge();

			$.cookie(cookiesKeys.isVisited, this.settings.checkDate, { expires: 7 })
		}
	},
	_startSound: function(){
		if(!isAudioPlayed){
			planetaKinoExt.audio.play();
		}
	}
};