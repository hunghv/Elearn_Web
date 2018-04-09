(function () {
  'use strict';

  angular
    .module('fuse')
    .factory('manageIndicatorApi', ManageIndicatorApi);

  /** @ngInject */
  function ManageIndicatorApi($resource, appConfig, $http, $window, $q) {
    var $q = $q;
    var api = {
      getIndicatorTypes: $resource(appConfig.ReportApi + 'api/Admin/Indicator/Type'),
      getIndicatorTab: $resource(appConfig.ReportApi + 'api/Admin/Indicator/Type/:type'),
      saveIndicator: $resource(appConfig.ReportApi + 'api/Admin/Indicator/Save')
    };

    function saveIndicator(request
    ) {
      var deferred = $q.defer();
      api.saveIndicator.save(
        JSON.stringify(request), function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    function getIndicatorTab(type, options
    ) {
      api.getIndicatorTab.get(
        {
          type: type
        }, function (data) {
          options.success(data);
        },
        function (data) {
          options.error(data);
        });
    }

    function getIndicatorTypes(
    ) {
      var deferred = $q.defer();
      api.getIndicatorTypes.query(
        {
          
        }
        , function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    return {
      api: api,
      getIndicatorTypes: getIndicatorTypes,
      getIndicatorTab: getIndicatorTab,
      saveIndicator: saveIndicator
    };
  }
})();