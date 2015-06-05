PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @param {PeerlanLib.Http.Client} $httpClient
 * @param {PeerlanApp.AutoInvesting.LoanIdsParser} $loanIdsParser
 * @param {PeerlanLib.Url.UrlParser} $urlParser
 * @param {PeerlanApp.BondoraUrlBuilder} $bondoraUrlBuilder
 * @constructor
 */
PeerlanApp.AutoInvesting.LoanListParser = function($httpClient, $loanIdsParser, $urlParser, $bondoraUrlBuilder) {

	this.downloadLoans = function(loansParsingSuccessCallback, loginNeededCallback, loansDownloadFailedCallback, filteredLoansUrls, loginUrlRegExp, loanIdRegExp) {
		var pendingRequests = 0;
		var allLoanIds = [];
		var stopProcessing = false;

		var successResponseCallback = function(url, content) {
			if (stopProcessing === true) {
				return;
			}

			var loginUrlRegExpObject = new RegExp(loginUrlRegExp);

			if (url.match(loginUrlRegExpObject)) {
				stopProcessing = true;
				var parsedUrl = $urlParser.parse(url);
				var bondoraLoginUrl = $bondoraUrlBuilder.buildUrl('/login');

				notifyBondoraLoginNeeded();
				loginNeededCallback(parsedUrl, bondoraLoginUrl);
				return;
			}

			pendingRequests--;
			notifyLoansUrlDownloaded(filteredLoansUrls, pendingRequests);

			console.log('Response from Bondora retrieved, pending requests: ' + pendingRequests);

			var newLoanIds = $loanIdsParser.parseLoans(content, loanIdRegExp);

			for (var z = 0; z < newLoanIds.length; z++) {
				if (allLoanIds.indexOf(newLoanIds[z]) === -1) {
					allLoanIds.push(newLoanIds[z]);
				}
			}

			if (pendingRequests === 0) {
				notifyAllLoanUrlsDownloaded();
				loansParsingSuccessCallback(allLoanIds)
			}
		};

		/**
		 * @param {String} url
		 * @param {Number} statusCode
		 * @param {String} content
		 * @param {PeerlanLib.Http.Client.Config} httpClientConfig
		 */
		var failedResponseCallback = function(url, statusCode, content, httpClientConfig) {
			if (stopProcessing === true) {
				return;
			}

			if (!url) {
				url = httpClientConfig.getUrl();
			}

			pendingRequests--;
			loansDownloadFailedCallback(url, statusCode, content);

			console.log('Request to Bondora failed, pending requests: ' + pendingRequests);

			if (pendingRequests === 0) {
				notifyAllLoanUrlsDownloaded();
				loansParsingSuccessCallback(allLoanIds)
			}
		};

		for (var i = 0; i < filteredLoansUrls.length; i++) {
			pendingRequests++;

			var config = new PeerlanLib.Http.Client.Config(filteredLoansUrls[i]);

			$httpClient.request(config, successResponseCallback, failedResponseCallback);
		}

		notifyLoansDownloadInitiated(pendingRequests);
	};

	function notifyLoansDownloadInitiated(pendingRequests) {
		notifyPage({
			name: 'loanListDownloadInitiated',
			loansUrlsCount: pendingRequests
		});
	}

	function notifyLoansUrlDownloaded(filteredLoansUrls, pendingRequests) {
		notifyPage({
			name: 'loanListDownloaded',
			completedRequests: (filteredLoansUrls.length - pendingRequests)
		});
	}

	function notifyAllLoanUrlsDownloaded() {
		notifyPage({
			name: 'allLoanUrlsDownloaded'
		});
	}

	function notifyBondoraLoginNeeded() {
		notifyPage({
			name: 'bondoraLoginNeeded'
		});
	}

};

}) (PeerlanApp);
