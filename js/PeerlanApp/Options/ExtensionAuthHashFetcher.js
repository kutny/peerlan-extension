PeerlanApp.Options = PeerlanApp.Options || {};

(function(PeerlanApp) {

/**
 * @param {String} $extensionAuthHashFetchEndpoint
 * @param {PeerlanLib.Http.Client} $httpClient
 * @constructor
 */
PeerlanApp.Options.ExtensionAuthHashFetcher = function($extensionAuthHashFetchEndpoint, $httpClient) {

	this.fetchExtensionAuthHash = function(hashRetrievedCallback, hashNotRetrievedCallback) {
		var config = new PeerlanLib.Http.Client.Config($extensionAuthHashFetchEndpoint);

		var successCallback = function(url, responseBody) {
			try {
				var jsonData = JSON.parse(responseBody);
			}
			catch (e) {
				hashNotRetrievedCallback();
				return;
			}

			hashRetrievedCallback(jsonData.extensionAuthHash);
		};

		$httpClient.request(config, successCallback, hashNotRetrievedCallback);
	};

};

}) (PeerlanApp);
