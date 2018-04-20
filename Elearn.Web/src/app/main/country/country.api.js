(function () {
    'use strict';

    angular
        .module('app.country')
        .factory('countryApi', countryApi);

    /** @ngInject */
    function countryApi($resource, appConfig, $http, $q) {
        var $q = $q;
        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/Country/GetAllCountries'),
            //postSave: $resource(appConfig.SkillApi + 'api/Admin/Categories/Update?id=:id&type=:type'),
            postSave: $resource(appConfig.SkillApi + 'api/Admin/Country/Update'),
            Delete: $resource(appConfig.SkillApi + 'api/Admin/Country/Delete?id=:id')

        };
        function getAll(options) {
            var deferred = $q.defer();
            api.getAll.save({},JSON.stringify(options),
                function (data){
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
              );
           
            return deferred.promise;
        };

        function postSave(options) {
            var deferred = $q.defer();
          //  api.postSave.save({id:1,type:2},JSON.stringify(options),
            api.postSave.save({},JSON.stringify(options),
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
              );
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();
            api.Delete.save({
                id: id
              }, JSON.stringify([]),
            function (data) {
                deferred.resolve(data);
            },
            function (data) {
                deferred.reject(data);
            }
          );
        return deferred.promise;
        }


        return {
            api: api,

            getAll: getAll,
            Delete: Delete,
            postSave: postSave,
        };
    }

})();