(function(PeerlanApp) {

/**
 * @constructor
 */
PeerlanApp.BondoraUrlBuilder = function() {

	this.buildUrl = function(pathWithoutLanguage) {
		var bondoraHostname = localStorage.getItem('bondoraHostname');
		var bondoraLanguage = localStorage.getItem('bondoraLanguage');

		return 'https://www.' + bondoraHostname + '/' + bondoraLanguage + pathWithoutLanguage;
	};

};

}) (PeerlanApp);
