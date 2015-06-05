(function(PeerlanLib) {

PeerlanLib.Url = PeerlanLib.Url || {};

/**
 * @constructor
 */
PeerlanLib.Url.UrlParser = function() {

	this.parse = function(url) {
		var link = document.createElement('a');
		link.href = url;

		return {
			scheme: link.protocol.substr(0, link.protocol.length - 1),
			hostname: link.hostname,
			hostnameWithoutWww: link.hostname.replace(/^www\./, ''),
			pathname: link.pathname ? link.pathname : null,
			hash: link.hash ? link.hash.substr(1) : null,
			search: link.search ? link.search.substr(1) : null
		};
	};

};

}) (PeerlanLib);
