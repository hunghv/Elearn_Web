(function () {
  'use strict';

  angular
    .module('fuse')
    .factory('activeDirectoryApi', ActiveDirectory);

  /** @ngInject */
  function ActiveDirectory($resource, appConfig, $http, $window, $q) {
    var $q = $q;
    var api = {
      searchAdUser: $resource(appConfig.ReportApi + 'api/ActiveDirectory', {}, { save: { method: 'POST', isArray: true } }),
      searchAdUserRole: $resource(appConfig.ReportApi + 'api/ActiveDirectory/SearchAdUserRole')
    };

    function searchUser(options, authors) {
      var deferred = $q.defer();
      var searchTerm = _.get(options, 'data.filter.filters[0].value');
      var exists = _.map(authors, function (o) { return o.name });

      api.searchAdUser.save({ searchTerm: searchTerm }, JSON.stringify(exists), function (res) {

        options.success(res);
      }, function (res) {

        options.error(res);
      });

      return deferred.promise;
    }

    function searchAdUserRole(options) {
      var deferred = $q.defer();
      var searchTerm = _.get(options, 'data.filter.filters[0].value');
      api.searchAdUserRole.query({ searchTerm: searchTerm }, function (res) {
        options.success(res);
      }, function (res) {
        options.error(res);
      });

      return deferred.promise;
    }

    return {
      api: api,
      searchUser: searchUser,
      searchAdUserRole: searchAdUserRole
    };
  }
})();