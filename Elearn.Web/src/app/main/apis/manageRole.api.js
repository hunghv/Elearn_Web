(function () {
  'use strict';

  angular
    .module('fuse')
    .factory('manageRoleApi', ManageRoleApi);

  /** @ngInject */
  function ManageRoleApi($resource, appConfig, $http, $window, $q) {
    var $q = $q;
    var api = {
      getAllUserRole: $resource(appConfig.ReportApi + 'api/Admin/UserRole/Search?tab=:tab'),
      getTotalRole: $resource(appConfig.ReportApi + 'api/Admin/UserRole/Total'),
      saveUserRole: $resource(appConfig.ReportApi + 'api/Admin/UserRole/Save'),
      saveUserRoleByDisplay: $resource(appConfig.ReportApi + 'api/Admin/UserRole/SaveRole'),
      deleteUserRole: $resource(appConfig.ReportApi + 'api/Admin/UserRole/Delete?id=:id')
    };

    function getAllUserRole(option, keyword, tab) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";

      api.getAllUserRole.save(
        { tab: tab },
        {
          keyWord: keyword,
          skip: option.data.skip,
          take: option.data.take,
          sortField: sortField,
          sortDir: sortDir
        }, function (data) {
          option.success(data);
        }, function (data) {

          option.error(data);
        });
    }

    function getTotalRole() {
      var deferred = $q.defer();
      api.getTotalRole.get({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    function saveUserRole(username, roles) {
      var deferred = $q.defer();
      api.saveUserRole.save({
        userName: username,
        roles: roles
      },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    function saveUserRoleByDisplay(username,displayName,department, roles) {
      var deferred = $q.defer();
      api.saveUserRoleByDisplay.save({
        userName: username,
        displayName: displayName,
        departmentName:department,
          roles: roles
        },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });

      return deferred.promise; 
    }

    function deleteUserRole(id) {
      var deferred = $q.defer();
      api.deleteUserRole.save({
        id: id
      }, JSON.stringify([]),
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    return {
      api: api,
      getAllUserRole: getAllUserRole,
      getTotalRole: getTotalRole,
      saveUserRole: saveUserRole,
      deleteUserRole: deleteUserRole,
      saveUserRoleByDisplay: saveUserRoleByDisplay
    };
  }
})();