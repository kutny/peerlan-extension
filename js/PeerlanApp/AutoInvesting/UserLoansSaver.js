PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @param {String} $userLoanSaveEndpoint
 * @param {PeerlanLib.Http.Client} $httpClient
 * @constructor
 *
 */
PeerlanApp.AutoInvesting.UserLoansSaver = function($userLoanSaveEndpoint, $httpClient) {

	this.saveUserLoans = function(loanIds, extensionAuthHash, newLoansFoundCallback) {
		var postData = 'loanIds=' + encodeURIComponent(loanIds.join(',')) + '&microtime=' + getMicrotime();

		var config = new PeerlanLib.Http.Client.Config($userLoanSaveEndpoint);
		config.setHeaders([
			{name: 'Authentication', value: extensionAuthHash},
			{name: 'Content-type', value: 'application/x-www-form-urlencoded'}
		]);
		config.setPostData(postData);

		var successCallback = function(url, responseText) {
			var responseJson = JSON.parse(responseText);

			if (responseJson.newLoansFound)
			{
				notifyNewLoansSaved();
				newLoansFoundCallback();
			}
		};

		$httpClient.request(config, successCallback, function() {});
	};

	function getMicrotime() {
		return new Date().getTime() / 1000;
	}

	function notifyNewLoansSaved() {
		notifyPage({
			name: 'newLoansSaved'
		});
	}

};

}) (PeerlanApp);
