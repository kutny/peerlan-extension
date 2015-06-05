PeerlanApp.AutoInvesting = PeerlanApp.AutoInvesting || {};

(function(PeerlanApp) {

/**
 * @constructor
 */
PeerlanApp.AutoInvesting.LoanIdsParser = function() {

	this.parseLoans = function(html, regExpString) {
		var globalRegExp = new RegExp(regExpString, 'g');
		var regExp = new RegExp(regExpString);

		var newLoanId;
		var matches = html.match(globalRegExp);

		if (!matches) {
			return [];
		}

		var newLoanIds = [];

		for (var i = 0; i < matches.length; i++) {
			newLoanId = matches[i].match(regExp)[1];

			newLoanIds.push(newLoanId);
		}

		return newLoanIds;
	};

};

}) (PeerlanApp);
