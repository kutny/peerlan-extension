(function(PeerlanApp) {

/**
 * @param {String} $messagingSenderId
 * @param {String} $extensionRegistrationEndpoint
 * @param {PeerlanLib.Http.Client} $httpClient
 * @param {PeerlanApp.Log.ServerLogger} $serverLogger
 * @constructor
 */
PeerlanApp.PushMessagesHandler = function($messagingSenderId, $extensionRegistrationEndpoint, $httpClient, $serverLogger) {

	this.registerListener = function() {
		chrome.storage.local.get('messagingRegistered', function(result) {
			if (result['messagingRegistered'])
			{
				return;
			}

			var senderIds = [$messagingSenderId];
			chrome.gcm.register(senderIds, registerCallback);
		});
	}

	function registerCallback(registrationId) {
		if (chrome.runtime.lastError) {
			$serverLogger.logOnServer('extensionIdRegistrationError', chrome.runtime.lastError.message, localStorage.getItem('extensionAuthHash'));
			return;
		}

		var config = createRegistrationRequestConfig(registrationId);

		$httpClient.request(config, extensionRegistrationSuccess, extensionRegistrationFailure);
	}

	function extensionRegistrationSuccess() {
		chrome.storage.local.set({messagingRegistered: true});
	}

	function extensionRegistrationFailure() {
	}

	function createRegistrationRequestConfig(registrationId) {
		var postData = 'registrationId=' + encodeURIComponent(registrationId);

		var config = new PeerlanLib.Http.Client.Config($extensionRegistrationEndpoint);
		config.setPostData(postData);
		config.setHeaders([
			{name: 'Authentication', value: localStorage.getItem('extensionAuthHash')}
		]);

		return config;
	}

};

}) (PeerlanApp);
