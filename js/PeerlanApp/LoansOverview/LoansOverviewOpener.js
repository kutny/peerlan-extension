PeerlanApp.LoansOverview = PeerlanApp.LoansOverview || {};

(function(PeerlanApp) {

/**
 * @param {String} $myLoansUrl
 * @param {PeerlanLib.Tab.TabOpener} $tabOpener
 * @constructor
 */
PeerlanApp.LoansOverview.LoansOverviewOpener = function($myLoansUrl, $tabOpener) {

	this.openLoansOverview = function() {
		$tabOpener.openTabIfNotExist($myLoansUrl);
	};

};

}) (PeerlanApp);
