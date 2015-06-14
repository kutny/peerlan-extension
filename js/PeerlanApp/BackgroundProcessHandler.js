(function(PeerlanApp) {

/**
 * @param {PeerlanApp.Options.ExtensionAuthHashFetcher} $extensionAuthHashFetcher
 * @param {PeerlanApp.PushMessagesHandler} $pushMessagesHandler
 * @param {PeerlanApp.LoansOverview.LoansOverviewOpener} $loansOverviewOpener
 * @constructor
 */
PeerlanApp.BackgroundProcessHandler = function($extensionAuthHashFetcher, $pushMessagesHandler, $loansOverviewOpener) {

	this.start = function() {
		chrome.browserAction.onClicked.addListener(extensionIconOnClickHandler);

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

		initExtension();
	};

	this.restart = function() {
		initExtension();
	};

	function initExtension() {
		if (!extensionAuthHashSet()) {
			fetchExtensionAuthHash();

			chrome.browserAction.setBadgeText({text: 'N/A'});
			return;
		}
		else {
			chrome.browserAction.setBadgeText({text: ''});
		}

		$pushMessagesHandler.registerListener();
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
