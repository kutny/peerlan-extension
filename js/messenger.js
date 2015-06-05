chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	var event = new CustomEvent('PeerlanMessage', {'detail': message});

	document.dispatchEvent(event);
});
