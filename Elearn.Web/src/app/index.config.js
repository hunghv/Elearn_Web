(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider, $compileProvider) {
        // Put your custom configurations here
        $httpProvider.interceptors.push(['$q', function ($q) {
			return {
				'responseError': function (rejection) {
                    var defer = $q.defer();
                    //rejection.status === 500 || 
					if (rejection.status === -1) {
						// window.location.href = '/pages/errors/error-500';
					    return rejection;

					} else if (rejection.status === 401) {
						window.location.href = '/pages/auth/login';
					}
					else {
						defer.reject(rejection);
						return defer.promise;
					}
				}
			};
        }]);

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
    }

})();