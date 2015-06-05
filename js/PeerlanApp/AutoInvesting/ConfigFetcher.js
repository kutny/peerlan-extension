PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @param {String} $fetchConfigUrl
 * @param {PeerlanLib.ExtensionIdManager} $extensionIdManager
 * @param {PeerlanLib.Http.Client} $httpClient
 * @constructor
 *
 */
PeerlanApp.AutoInvesting.ConfigFetcher = function($fetchConfigUrl, $extensionIdManager, $httpClient) {

	this.fetchConfig = function(successCallback, failureCallback) {
		var extensionAuthHash = localStorage.getItem('extensionAuthHash');

		console.log('Retrieving new loans');

		var url = $fetchConfigUrl + '?extensionId=' + $extensionIdManager.getExtensionId() + '&extensionVersion=' + chrome.app.getDetails().version;

		var config = new PeerlanLib.Http.Client.Config(url);
		config.setHeaders([
			{name: 'Authentication', value: extensionAuthHash}
		]);

		var responseSuccessCallback = function(url, responseText) {
			var jsonData = JSON.parse(responseText);

			successCallback(jsonData);
		};

		$httpClient.request(config, responseSuccessCallback, failureCallback);
	};

};

}) (PeerlanApp);
