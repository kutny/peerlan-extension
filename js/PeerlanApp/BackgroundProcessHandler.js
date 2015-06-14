(function(PeerlanApp) {

/**
 * @param {Number} $loansCheckingTimeoutSeconds
 * @param {PeerlanApp.Options.ExtensionAuthHashFetcher} $extensionAuthHashFetcher
 * @param {PeerlanApp.PushMessagesHandler} $pushMessagesHandler
 * @param {PeerlanApp.AutoInvesting.InvestingRobot} $investingRobot
 * @param {PeerlanApp.LoansOverview.LoansOverviewOpener} $loansOverviewOpener
 * @constructor
 */
PeerlanApp.BackgroundProcessHandler = function($loansCheckingTimeoutSeconds, $extensionAuthHashFetcher, $pushMessagesHandler, $investingRobot, $loansOverviewOpener) {

	var investingIntervalId;
	var countdown;

	this.start = function() {
		chrome.browserAction.onClicked.addListener(extensionIconOnClickHandler);

		var onMessageExternalListener = function(request, sender, sendResponse) {
			if (request.name === 'checkLoans') {
				$investingRobot.startInvesting();
			}
			else if (request.name === 'returnNexLoansCheckTimeout') {
				sendResponse({countdownTime: Math.round(countdown.getCurrentTime())});
			}
		};

		chrome.runtime.onMessageExternal.addListener(onMessageExternalListener);

		chrome.gcm.onMessage.addListener(function(message) {
			var messageData = message.data;

			var notification = new Notification(messageData.title, {
				icon: chrome.extension.getURL('/img/icon_128.png'),
				body: messageData.body
			});

			notification.addEventListener('click', function() {
				$loansOverviewOpener.openLoansOverview();
			});
		});

		startInvestingRobot();
	};

	this.restart = function() {
		if (investingIntervalId) {
			clearInterval(investingIntervalId);
		}

		startInvestingRobot();
	};

	function startInvestingRobot() {
		if (!extensionAuthHashSet()) {
			fetchExtensionAuthHash();

			chrome.browserAction.setBadgeText({text: 'N/A'});
			return;
		}
		else {
			chrome.browserAction.setBadgeText({text: ''});
		}

		$pushMessagesHandler.registerListener();

		countdown = new PeerlanApp.AutoInvesting.Countdown($loansCheckingTimeoutSeconds);
		$investingRobot.startInvesting();

		investingIntervalId = setInterval(
			function() {
				countdown = new PeerlanApp.AutoInvesting.Countdown($loansCheckingTimeoutSeconds);

				$investingRobot.startInvesting();
			},
			$loansCheckingTimeoutSeconds * 1000
		);
	}

	function fetchExtensionAuthHash() {
		var hashRetrievedCallback = function(extensionAuthHash) {
			localStorage.setItem('extensionAuthHash', extensionAuthHash);

			chrome.extension.getBackgroundPage().backgroundProcessHandler.restart();

			$loansOverviewOpener.openLoansOverview();
		};

		var hashNotRetrievedCallback = function() {
			showOptions();
		};

		$extensionAuthHashFetcher.fetchExtensionAuthHash(hashRetrievedCallback, hashNotRetrievedCallback);
	}

	function extensionAuthHashSet() {
		return localStorage.getItem('extensionAuthHash') !== '' && localStorage.getItem('extensionAuthHash') !== null;
	}

	function extensionIconOnClickHandler() {
		if (extensionAuthHashSet()) {
			$loansOverviewOpener.openLoansOverview();
		}
		else {
			showOptions();
		}
	}

	function showOptions() {
		chrome.runtime.openOptionsPage(function() {});
	}

};

}) (PeerlanApp);
