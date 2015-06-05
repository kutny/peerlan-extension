PeerlanApp.LoansOverview = PeerlanApp.LoansOverview || {};

(function(PeerlanApp) {

/**
 * @param {String} $newLoansCheckingUrl
 * @param {PeerlanLib.Tab.TabOpener} $tabOpener
 * @constructor
 */
PeerlanApp.LoansOverview.LoansOverviewOpener = function($newLoansCheckingUrl, $tabOpener) {

	this.openLoansOverview = function() {
		$tabOpener.openTabIfNotExist($newLoansCheckingUrl);
	};

};

}) (PeerlanApp);
