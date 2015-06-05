PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @param {PeerlanApp.AutoInvesting.ConfigFetcher} $configFetcher
 * @param {PeerlanApp.AutoInvesting.LoanListParser} $loanListParser
 * @param {PeerlanLib.Tab.TabOpener} $tabOpener
 * @param {PeerlanApp.LoansOverview.LoansOverviewOpener} $loansOverviewOpener
 * @param {PeerlanApp.Log.ServerLogger} $serverLogger
 * @param {PeerlanApp.AutoInvesting.UserLoansSaver} $userLoansSaver
 * @constructor
 *
 */
PeerlanApp.AutoInvesting.InvestingRobot = function($configFetcher, $loanListParser, $tabOpener, $loansOverviewOpener, $serverLogger, $userLoansSaver) {

	this.startInvesting = function() {
		$configFetcher.fetchConfig(configFetchSuccessCallback, configFetchFailureCallback);
	};

	function configFetchSuccessCallback(data) {
		localStorage.setItem('bondoraHostname', data.bondoraHostname);
		localStorage.setItem('bondoraLanguage', data.bondoraLanguage);

		$loanListParser.downloadLoans(
			loansParsingSuccessCallback,
			loginNeededCallback,
			loansDownloadFailedCallback,
			data.filteredLoansUrls,
			data.parsing.loginUrlRegExp,
			data.parsing.loanIdRegExp
		);
	}

	function configFetchFailureCallback() {
	}

	function loansParsingSuccessCallback(newLoanIds) {
		if (newLoanIds.length > 0) {
			$userLoansSaver.saveUserLoans(newLoanIds, localStorage.getItem('extensionAuthHash'), newLoansFound);
		}
	}

	function newLoansFound() {
		var notification = new Notification('New Bondora loans found', {
			icon: chrome.extension.getURL('/img/icon_128.png'),
			body: 'Click to check them'
		});

		notification.addEventListener('click', function() {
			$loansOverviewOpener.openLoansOverview();
		});
	}

	function loginNeededCallback(parsedUrl, loginUrl) {
		var notification = new Notification('Sign in to ' + parsedUrl.hostnameWithoutWww + ' needed!', {
			icon: chrome.extension.getURL('/img/icon_128.png'),
			body: 'Peerlan cannot download ' + parsedUrl.hostnameWithoutWww + ' loan lists'
		});

		notification.addEventListener('click', function() {
			$tabOpener.openTabIfNotExist(loginUrl);
		});
	}

	function loansDownloadFailedCallback(url, statusCode, content) {
		$serverLogger.logOnServer(
			'Unable to download Bondora URL',
			'url: ' + url + ', status: ' + statusCode + ', content: ' + content,
			localStorage.getItem('extensionAuthHash')
		);
	}

};

}) (PeerlanApp);
