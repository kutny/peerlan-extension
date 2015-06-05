PeerlanApp.Options = PeerlanApp.Options || {};

(function(PeerlanApp) {

/**
 * @param {String} $profilePageUrl
 * @param {String} $authHashValidationUrl
 * @param {PeerlanLib.Http.Client} $httpClient
 * @param {PeerlanApp.LoansOverview.LoansOverviewOpener} $loansOverviewOpener
 * @constructor
 */
PeerlanApp.Options.OptionsController = function($profilePageUrl, $authHashValidationUrl, $httpClient, $loansOverviewOpener) {

	this.init = function() {
		document.getElementById('extensionAuthHash').value = localStorage.getItem('extensionAuthHash');
		document.getElementById('peerlanOptionsForm').addEventListener('submit', saveExtensionAuthHash, false);
		document.getElementById('peerlanProfileUrl').setAttribute('href', $profilePageUrl);
	};

	function saveExtensionAuthHash(event) {
		var extensionAuthHash = document.getElementById('extensionAuthHash').value;

		var config = new PeerlanLib.Http.Client.Config($authHashValidationUrl);
		config.setPostData('extensionAuthHash=' + extensionAuthHash);

		setSubmitButtonAsSaving();

		$httpClient.request(config, successResponseCallback, errorResponseCallback);

		event.preventDefault();
	}

	function successResponseCallback(url, responseText) {
		var responseJson = JSON.parse(responseText);

		if (!responseJson.authHashIdValid) {
			setSubmitButtonAsFailed();

			alert('Authentication key is invalid, please check it again on your Peerlan profile page.');

			setTimeout(setSubmitButtonDefault, 1000);
			return;
		}

		localStorage.setItem('extensionAuthHash', responseJson.extensionAuthHash);

		chrome.extension.getBackgroundPage().backgroundProcessHandler.restart();

		setSubmitButtonAsSaved();

		$loansOverviewOpener.openLoansOverview();

		setTimeout(setSubmitButtonDefault, 1000);
	}

	function errorResponseCallback() {
		alert('Some error occured, please try again later');

		setSubmitButtonDefault();
	}

	function setSubmitButtonAsSaving() {
		document.getElementById('saveOptions').setAttribute('data-original-label', document.getElementById('saveOptions').innerHTML);
		document.getElementById('saveOptions').setAttribute('disabled', 'disabled');
		document.getElementById('saveOptions').innerHTML = 'Saving...';
	}

	function setSubmitButtonAsSaved() {
		document.getElementById('saveOptions').innerHTML = 'Saved';
		document.getElementById('saveOptions').style.color = 'green';
	}

	function setSubmitButtonAsFailed() {
		document.getElementById('saveOptions').innerHTML = 'Invalid key';
		document.getElementById('saveOptions').style.color = 'red';
	}

	function setSubmitButtonDefault() {
		document.getElementById('saveOptions').removeAttribute('disabled');
		document.getElementById('saveOptions').innerHTML = document.getElementById('saveOptions').getAttribute('data-original-label');
		document.getElementById('saveOptions').style.color = 'black';
	}

};

}) (PeerlanApp);
