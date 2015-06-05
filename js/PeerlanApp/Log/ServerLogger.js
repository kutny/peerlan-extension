PeerlanApp.Log = PeerlanApp.Log || {};

(function(PeerlanApp) {

/**
 * @param {String} $loggingEndpoint
 * @param {PeerlanLib.ExtensionIdManager} $extensionIdManager
 * @constructor
 */
PeerlanApp.Log.ServerLogger = function($loggingEndpoint, $extensionIdManager) {

	this.logOnServer = function(messageName, messageContent, extensionAuthHash) {
		if (typeof(messageContent) === 'object') {
			messageContent = JSON.stringify(messageContent);
		}

		var url = $loggingEndpoint + '?extensionId=' + $extensionIdManager.getExtensionId() + '&extensionVersion=' + chrome.app.getDetails().version;
		var postData = 'messageName=' + encodeURIComponent(messageName) + '&messageContent=' + encodeURIComponent(messageContent) + '&microtime=' + getMicrotime();

		var request = new XMLHttpRequest();

		request.open('post', url, true);
		request.setRequestHeader('Authentication', extensionAuthHash);
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		request.send(postData);
	};

	function getMicrotime() {
		return new Date().getTime() / 1000;
	}

};

}) (PeerlanApp);
