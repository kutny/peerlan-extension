(function(PeerlanLib) {

PeerlanLib.Http = PeerlanLib.Http || {};
PeerlanLib.Http.Client = PeerlanLib.Http.Client || {};

/**
 * @constructor
 */
PeerlanLib.Http.Client.Config = function(url) {

	var
		_url = url,
		_timeout = 30,
		_postData = null,
		_headers = [];

	this.getUrl = function() {
		return _url;
	};

	this.getTimeout = function() {
		return _timeout;
	};

	this.setTimeout = function(timeout) {
		_timeout = timeout;
	};

	this.getPostData = function() {
		return _postData;
	};

	/**
	 * @param {String} postData
	 */
	this.setPostData = function(postData) {
		_postData = postData;
	};

	this.getHeaders = function() {
		return _headers;
	};

	this.setHeaders = function(headers) {
		_headers = headers;
	};

};

}) (PeerlanLib);
