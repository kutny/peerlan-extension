(function(PeerlanApp) {

/**
 * @param {String} $messagingSenderId
 * @param {String} $extensionRegistrationEndpoint
 * @param {String} $extensionUnregistrationEndpoint
 * @param {PeerlanLib.Http.Client} $httpClient
 * @param {PeerlanApp.Log.ServerLogger} $serverLogger
 * @constructor
 */
PeerlanApp.PushMessagesHandler = function($messagingSenderId, $extensionRegistrationEndpoint, $extensionUnregistrationEndpoint, $httpClient, $serverLogger) {

	this.registerListener = function() {
		chrome.storage.local.get('extensionRegistrationId', function(result) {
			if (result['extensionRegistrationId'])
			{
				return;
			}

			var senderIds = [$messagingSenderId];
			chrome.gcm.register(senderIds, registerCallback);
		});

		chrome.gcm.unregister(unregisterCallback);
	}

	function registerCallback(registrationId) {
		if (chrome.runtime.lastError) {
			$serverLogger.logOnServer('extensionIdRegistrationError', chrome.runtime.lastError.message, localStorage.getItem('extensionAuthHash'));
			return;
		}

		var config = createRegistrationRequestConfig($extensionRegistrationEndpoint, registrationId);

		$httpClient.request(config, extensionRegistrationSuccess, extensionRegistrationFailure);
	}

	function extensionRegistrationSuccess(responseURL, responseText, config) {
		var jsonResponse = JSON.parse(responseText);

		chrome.storage.local.set({extensionRegistrationId: jsonResponse.registrationId});
	}

	function extensionRegistrationFailure() {
	}

	function unregisterCallback() {
		if (chrome.runtime.lastError) {
			$serverLogger.logOnServer('extensionIdUnregistrationError', chrome.runtime.lastError.message, localStorage.getItem('extensionAuthHash'));
			return;
		}

		chrome.storage.local.get('extensionRegistrationId', function(result) {
			var config = createRegistrationRequestConfig($extensionUnregistrationEndpoint, result['extensionRegistrationId']);

			$httpClient.request(config, extensionUnregistrationSuccess, extensionUnregistrationFailure);
		});
	}

	function extensionUnregistrationSuccess() {
		chrome.storage.local.remove('extensionRegistrationId');
	}

	function extensionUnregistrationFailure() {
		chrome.storage.local.remove('extensionRegistrationId');
	}

	function createRegistrationRequestConfig(endpoint, registrationId) {
		var postData = 'registrationId=' + encodeURIComponent(registrationId);

		var config = new PeerlanLib.Http.Client.Config(endpoint);
		config.setPostData(postData);
		config.setHeaders([
			{name: 'Authentication', value: localStorage.getItem('extensionAuthHash')}
		]);

		return config;
	}

};

}) (PeerlanApp);
