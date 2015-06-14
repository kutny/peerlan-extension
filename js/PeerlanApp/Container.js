(function(window, PeerlanLib, PeerlanApp) {

	/**
	 * @constructor
	 */
	PeerlanApp.Container = function($parameters) {
		var $this = this;
		var $services = {};

		/**
		 * @returns PeerlanLib.Http.Client
		 */
		this.getHttpClient = function() {
			return getService(
				'getAjaxFormHandler',
				function() {
					return new PeerlanLib.Http.Client(
						$this.getXmlHttpRequestFactory()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.Log.ServerLogger
		 */
		this.getServerLogger = function() {
			return getService(
				'getServerLogger',
				function() {
					return new PeerlanApp.Log.ServerLogger(
						$parameters.serverLoggerUrl,
						$this.getExtensionIdManager()
					);
				}
			)
		};

		/**
		 * @returns PeerlanLib.Ajax.XmlHttpRequestFactory
		 */
		this.getXmlHttpRequestFactory = function() {
			return getService(
				'getXmlHttpRequestFactory',
				function() {
					return new PeerlanLib.Ajax.XmlHttpRequestFactory();
				}
			)
		};

		/**
		 * @returns PeerlanLib.ExtensionIdManager
		 */
		this.getExtensionIdManager = function() {
			return getService(
				'getExtensionIdManager',
				function() {
					return new PeerlanLib.ExtensionIdManager();
				}
			)
		};

		/**
		 * @returns PeerlanApp.AutoInvesting.LoanListParser
		 */
		this.getLoanListParser = function() {
			return getService(
				'getLoanListParser',
				function() {
					return new PeerlanApp.AutoInvesting.LoanListParser(
						$this.getHttpClient(),
						$this.getLoanIdsParser(),
						$this.getUrlParser(),
						$this.getBondoraUrlBuilder()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.AutoInvesting.ConfigFetcher
		 */
		this.getConfigFetcher = function() {
			return getService(
				'getConfigFetcher',
				function() {
					return new PeerlanApp.AutoInvesting.ConfigFetcher(
						$parameters.fetchConfigUrl,
						$this.getExtensionIdManager(),
						$this.getHttpClient()
					);
				}
			)
		};

		/**
		 * @returns PeerlanLib.Url.UrlParser
		 */
		this.getUrlParser = function() {
			return getService(
				'getUrlParser',
				function() {
					return new PeerlanLib.Url.UrlParser();
				}
			)
		};

		/**
		 * @returns PeerlanLib.Tab.TabOpener
		 */
		this.getTabOpener = function() {
			return getService(
				'getTabOpener',
				function() {
					return new PeerlanLib.Tab.TabOpener();
				}
			)
		};

		/**
		 * @returns PeerlanApp.AutoInvesting.InvestingRobot
		 */
		this.getInvestingRobot = function() {
			return getService(
				'getInvestingRobot',
				function() {
					return new PeerlanApp.AutoInvesting.InvestingRobot(
						$this.getConfigFetcher(),
						$this.getLoanListParser(),
						$this.getTabOpener(),
						$this.getLoansOverviewOpener(),
						$this.getServerLogger(),
						$this.getUserLoansSaver()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.AutoInvesting.UserLoansSaver
		 */
		this.getUserLoansSaver = function() {
			return getService(
				'getUserLoansSaver',
				function() {
					return new PeerlanApp.AutoInvesting.UserLoansSaver(
						$parameters.userLoanSaveEndpoint,
						$this.getHttpClient()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.AutoInvesting.LoanIdsParser
		 */
		this.getLoanIdsParser = function() {
			return getService(
				'getLoanIdsParser',
				function() {
					return new PeerlanApp.AutoInvesting.LoanIdsParser();
				}
			)
		};

		/**
		 * @returns PeerlanApp.Options.ExtensionAuthHashFetcher
		 */
		this.getExtensionAuthHashFetcher = function() {
			return getService(
				'getExtensionAuthHashFetcher',
				function() {
					return new PeerlanApp.Options.ExtensionAuthHashFetcher(
						$parameters.extensionAuthHashFetchEndpoint,
						$this.getHttpClient()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.Options.OptionsController
		 */
		this.getOptionsController = function() {
			return getService(
				'getOptionsController',
				function() {
					return new PeerlanApp.Options.OptionsController(
						$parameters.profilePageUrl,
						$parameters.authHashValidationUrl,
						$this.getHttpClient(),
						$this.getLoansOverviewOpener()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.LoansOverview.LoansOverviewOpener
		 */
		this.getLoansOverviewOpener = function() {
			return getService(
				'getLoansOverviewOpener',
				function() {
					return new PeerlanApp.LoansOverview.LoansOverviewOpener(
						$parameters.newLoansCheckingUrl,
						$this.getTabOpener()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.BackgroundProcessHandler
		 */
		this.getBackgroundProcessHandler = function() {
			return getService(
				'getBackgroundProcessHandler',
				function() {
					return new PeerlanApp.BackgroundProcessHandler(
						$parameters.loansCheckingTimeoutSeconds,
						$this.getExtensionAuthHashFetcher(),
						$this.getPushMessagesHandler(),
						$this.getInvestingRobot(),
						$this.getLoansOverviewOpener()
					);
				}
			)
		};

		/**
		 * @returns PeerlanApp.BondoraUrlBuilder
		 */
		this.getBondoraUrlBuilder = function() {
			return getService(
				'getBondoraUrlBuilder',
				function() {
					return new PeerlanApp.BondoraUrlBuilder();
				}
			)
		};

		/**
		 * @returns PeerlanApp.PushMessagesHandler
		 */
		this.getPushMessagesHandler = function() {
			return getService(
				'getPushMessagesHandler',
				function() {
					return new PeerlanApp.PushMessagesHandler(
						$parameters.messagingSenderId,
						$parameters.extensionRegistrationEndpoint,
						$parameters.extensionUnregistrationEndpoint,
						$this.getHttpClient(),
						$this.getServerLogger()
					);
				}
			)
		};

		function getService(name, createInstanceCallback) {
			if (typeof $services[name] === 'undefined') {
				$services[name] = createInstanceCallback();
			}
			return $services[name];
		}

	};

}) (window, PeerlanLib, PeerlanApp);

function buildParameters() {
	var peerlanBaseUrl = 'http://peerlan.my';

	return {
		messagingSenderId: '212859967210',
		extensionRegistrationEndpoint: peerlanBaseUrl + '/extension/messaging-registration',
		extensionUnregistrationEndpoint: peerlanBaseUrl + '/extension/messaging-unregistration',
		fetchConfigUrl: peerlanBaseUrl + '/extension/fetch-config',
		authHashValidationUrl: peerlanBaseUrl + '/extension/auth-hash-validation',
		serverLoggerUrl: peerlanBaseUrl + '/extension/log',
		profilePageUrl: peerlanBaseUrl + '/profile',
		filterListPageUrl: peerlanBaseUrl + '/filters',
		newLoansCheckingUrl: peerlanBaseUrl + '/new-loans-checking',
		extensionAuthHashFetchEndpoint: peerlanBaseUrl + '/extension/auth-hash-fetch',
		userLoanSaveEndpoint: peerlanBaseUrl + '/extension/save-user-loans',
		loansCheckingTimeoutSeconds: 5 * 60
	};
}

function notifyPage(message) {
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, message);
		}
	});
}

var container = new PeerlanApp.Container(buildParameters());