(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('accountApi', AccountApi);

    /** @ngInject */
    function AccountApi($resource, appConfig, $http,$window, $q) {
        var $q = $q;

        var api = {
            getDomains: $resource(appConfig.SSOApi + 'api/Domains'),
            login: $resource(appConfig.ReportApi + 'api/Account/Login'),
            logoutAccount: $resource(appConfig.ReportApi + 'api/Account/Logout'),
            getUserLogin: $resource(appConfig.ReportApi + 'api/Account/GetUserLogin')
        };

        function getDomains() {

            var deferred = $q.defer();
            api.getDomains.query({},
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                    // console.log(data);
                }
            );

            return deferred.promise;
        }

        function getUserLogin() {
          var deferred = $q.defer();
          api.getUserLogin.get({},
            function (data) {
              deferred.resolve(data);
            },
            function (data) {
              deferred.reject(data);
            }
          );

          return deferred.promise;
        }

      function getUserInfo() {
          var userInfo = {};
          if ($window.localStorage.UserInfo != null && $window.localStorage.UserInfo != '') {
            userInfo = JSON.parse($window.localStorage.UserInfo);
          }

          return userInfo;
      };

        return {
            api: api,
            getUserInfo: getUserInfo,
            getDomains: getDomains,
            getUserLogin: getUserLogin
        };
    }

})();