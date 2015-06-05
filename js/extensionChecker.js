document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener(
		'PeerlanExtensionDetectEvent',
		function (event) {
			var request = {};

			chrome.extension.sendRequest(request, function(response) {
				var responseEvent = document.createEvent('Events');
				responseEvent.initEvent('PeerlanExtensionDetectedEvent', true, false);

				event.target.dispatchEvent(responseEvent);
			});
		},
		false,
		true
	);

}, false);
