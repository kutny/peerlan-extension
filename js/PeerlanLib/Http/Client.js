(function(PeerlanLib) {

PeerlanLib.Http = PeerlanLib.Http || {};

/**
 * @param {PeerlanLib.Ajax.XmlHttpRequestFactory} xmlHttpRequestFactory
 * @constructor
 */
PeerlanLib.Http.Client = function(xmlHttpRequestFactory) {

	/**
	 * @param {PeerlanLib.Http.Client.Config} config
	 * @param successCallback
	 * @param errorCallback
	 */
	this.request = function(config, successCallback, errorCallback) {
		var request = createRequest(config);
		var requestTimeout;

		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				var requestStatus;
				try {
					/* Firefox may throw "Unable to retrieve status property" there */
					requestStatus = request.status;
				}
				catch (e) {
					return;
				}
				clearTimeout(requestTimeout);

				if (requestStatus == 200) {
					successCallback(request.responseURL, request.responseText, config);
				}
				else {
					errorCallback(request.responseURL, requestStatus, request.responseText, config);
				}
			}
		};

		requestTimeout = setTimeout(
			function() {
				request.abort();
			},
			config.getTimeout() * 1E3
		);

		request.send(config.getPostData() ? config.getPostData() : null);
	};

	/**
	 * @param {PeerlanLib.Http.Client.Config} config
	 */
	function createRequest(config) {
		var request = xmlHttpRequestFactory.createXmlHttpRequest();

		if (config.getPostData()) {
			request.open('post', config.getUrl());

			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		else {
			request.open('get', config.getUrl());
		}

		setRequestHeaders(request, config.getHeaders());

		return request;
	}

	function setRequestHeaders(request, requestHeaders) {
		for (var i = 0; i < requestHeaders.length; i++) {
			request.setRequestHeader(requestHeaders[i].name, requestHeaders[i].value);
		}
	}

};

}) (PeerlanLib);
