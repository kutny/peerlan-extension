PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @constructor
 *
 */
PeerlanApp.AutoInvesting.Countdown = function(countdownStart) {

	var currentTime = countdownStart;

	var countdownInterval = setInterval(function() {
		currentTime = currentTime - 1;

		if (currentTime == 0) {
			clearInterval(countdownInterval);
		}
	}, 1000);

	this.getCurrentTime = function() {
		return currentTime;
	};

};

}) (PeerlanApp);
