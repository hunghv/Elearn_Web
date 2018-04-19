(function () {
    'use strict';

    angular
        .module('app.categories')
        .factory('CategotieslApi', CategotieslApi);

    /** @ngInject */
    function CategotieslApi($resource, appConfig, $http, $q) {
        var $q = $q;
        var api = {
            
            getAll: $resource(appConfig.SkillApi + 'api/Admin/Categories/GetAllCategories'),
            postSave: $resource(appConfig.SkillApi + 'api/Admin/Categories/Update?id=:id&type=:type'),
            Delete: $resource(appConfig.SkillApi + 'api/Admin/Categories/Delete')

        };
        function getAll(options) {
            var deferred = $q.defer();
            debugger;
            api.getAll.save({request:options.pagging},
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

            api.postSave.save({id:1,type:2},JSON.stringify(options),
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
            return api.Delete.save({ id: id }).$promise;
        }


        return {
            api: api,

            getAll: getAll,
            Delete: Delete,
            postSave: postSave,
        };
    }

})();