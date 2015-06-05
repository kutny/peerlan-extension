(function(PeerlanLib) {

PeerlanLib.Ajax = PeerlanLib.Ajax || {};

/**
 * @constructor
 */
PeerlanLib.Ajax.XmlHttpRequestFactory = function() {

	this.createXmlHttpRequest = function() {
		return new XMLHttpRequest();
	};

};

}) (PeerlanLib);
