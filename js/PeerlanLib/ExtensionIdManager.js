(function(PeerlanLib) {

/**
 * @constructor
 */
PeerlanLib.ExtensionIdManager = function() {

	this.getExtensionId = function() {
		if (!extensionIdExist()) {
			localStorage.setItem('extensionId', generateExtensionId());
		}

		return localStorage.getItem('extensionId');
	}

	function extensionIdExist() {
		return localStorage.getItem('extensionId') !== '' && localStorage.getItem('extensionId') !== null;
	}

	function generateExtensionId() {
		var extensionId;

		extensionId = new Date().valueOf().toString();
		extensionId += Math.random().toString();
		extensionId = new MD5().digest(extensionId);

		return extensionId
	}

};

}) (PeerlanLib);
