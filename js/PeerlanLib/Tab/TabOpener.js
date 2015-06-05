PeerlanLib.Tab = PeerlanLib.Tab || {};

(function(PeerlanLib) {

/**
 * @constructor
 */
PeerlanLib.Tab.TabOpener = function() {

	this.openTab = function(url) {
		chrome.tabs.create({url: url});
	};

	this.openTabIfNotExist = function(url) {
		chrome.tabs.query({url: url}, function(tabs) {
			if (tabs.length) {
				chrome.tabs.update(tabs[0].id, {active: true});
			}
			else {
				chrome.tabs.create({url: url});
			}
		});
	};

};

}) (PeerlanLib);
