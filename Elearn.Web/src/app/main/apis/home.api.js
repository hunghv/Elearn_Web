(function () {
  'use strict';

  angular
    .module('fuse')
    .factory('homeApi', HomeApi);

  /** @ngInject */
  function HomeApi($resource, appConfig, $http, $window, $q) {
    var $q = $q;

    var api = {
      search: $resource(appConfig.ReportApi + "api/Report/Search"),
      total: $resource(appConfig.ReportApi + "api/Report/Total"),
      deleteReport: $resource(appConfig.ReportApi + "api/Report?reportId=:id"),
      deleteDetailReport: $resource(appConfig.ReportApi + "api/ReportDetail?reportId=:id"),
      searchAdvancedDefault: $resource(appConfig.ReportApi + "api/Search"),
      searchHomeDefault: $resource(appConfig.ReportApi + "api/Search/DefaultHome"),
      searchDetailDefault: $resource(appConfig.ReportApi + "api/Search/DetailDefault"),
      getUnits: $resource(appConfig.ReportApi + 'api/Unit?areaId=:areaId'),
      getUnitArea: $resource(appConfig.ReportApi + 'api/Unit/GetUnitArea?areaId=:areaId'),
      getGroups: $resource(appConfig.ReportApi + 'api/InstrumentationGroup?areaId=:areaId'),
      getGroupArea: $resource(appConfig.ReportApi + 'api/InstrumentationGroup/GetGroupArea?areaId=:areaId'),
      getTypes: $resource(appConfig.ReportApi + 'api/InstrumentationType?groupId=:groupId'),
      getTags: $resource(appConfig.ReportApi + 'api/Tag/Search?tagNo=:tagNo'),
      getArea: $resource(appConfig.ReportApi + 'api/Search/Area'),
      getUsers: $resource(appConfig.ReportApi + 'api/Search/UserProfile?searchTerm=:searchTerm'),
      getAllUsers: $resource(appConfig.ReportApi + 'api/Search/UserLocal?keyword=:keyword'),
      searchAdvanced: $resource(appConfig.ReportApi + 'api/Search/Report'),
      searchDetailReport: $resource(appConfig.ReportApi + 'api/Search/DetailReport')
    };

    function searchReport(option, keyword, tab) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
      if(option.data.filter != undefined){
        var filters = _.map(option.data.filter.filters, function(item){
          return {field:item.field,value: item.value, operator: item.operator};
        })}
      api.search.save({
        tab: tab,
        keyword: keyword,
        skip: option.data.skip,
        take: option.data.take,
        sortField: sortField,
        sortDir: sortDir,
        filters:filters,
        isExport: false
      },function(data) {
        option.success(data);
      },function(data) {
        option.error(data);
      });
    }

    function searchDetailReport(option, createBy, areaId, statusId, startDate, endDate) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";    
      if(option.data.filter != undefined){
        var filters = _.map(option.data.filter.filters, function(item){
          return {field:item.field,value: item.value, operator: item.operator};
        })}
      api.searchDetailReport.save({
        createBy: createBy,
        startDate: startDate,
        statusId: statusId,
        areaId: areaId,
        endDate: endDate,
        skip: option.data.skip,
        take: option.data.take,
        sortField: sortField,
        sortDir: sortDir,
        filters:filters,
        isExport: false
      }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function searchAdvancedReport(option, createBy, areaId, startDate,
      unitId, endDate, groupId, tagNo, workCompletionId,constraintId,
      typeId, statusId, workTypeId, failureTypeId) {
      var sortField = option.data.sort != undefined ? option.data.sort[0].field : "";
      var sortDir = option.data.sort != undefined ? option.data.sort[0].dir : "";
      if(option.data.filter != undefined){
      var filters = _.map(option.data.filter.filters, function(item){
        return {field:item.field,value: item.value, operator: item.operator};
      })}
      api.searchAdvanced.save({
        createBy: createBy,
        startDate: startDate,
        endDate: endDate,
        tagNo: tagNo,
        workCompletionId: workCompletionId,
        constraintId: constraintId,
        statusId: statusId,
        areaId: areaId,
        unitId: unitId,
        groupId: groupId,
        typeId: typeId,
        workTypeId: workTypeId,
        failureTypeId: failureTypeId,
        skip: option.data.skip,
        take: option.data.take,
        sortField: sortField,
        sortDir: sortDir,
        filters:filters
      }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function searchAdvancedDefault() {
      var deferred = $q.defer();
      api.searchAdvancedDefault.get({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function searchHomeDefault() {
      var deferred = $q.defer();
      api.searchHomeDefault.get({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function searchDetailDefault() {
      var deferred = $q.defer();
      api.searchDetailDefault.get({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getAreas() {
      var deferred = $q.defer();
      api.getArea.query({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getAllUsers(keyword) {
      var deferred = $q.defer();
      api.getAllUsers.query({keyword:keyword},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getTotalReport() {
      var deferred = $q.defer();
      api.total.get({},
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getUnitArea(areaId) {
      var deferred = $q.defer();
      api.getUnitArea.query({ areaId: areaId },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getGroupArea(areaId) {
      var deferred = $q.defer();
      api.getGroupArea.query({ areaId: areaId },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getUnitsById(areaId) {
      var deferred = $q.defer();
      api.getUnits.query({ areaId: areaId },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getGroupsById(areaId) {
      var deferred = $q.defer();
      api.getGroups.query({ areaId: areaId },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getTypesById(groupId) {
      var deferred = $q.defer();
      api.getTypes.query({ groupId: groupId },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getTags(tagNo) {
      var deferred = $q.defer();
      api.getTags.query({ tagNo: tagNo },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function getUsers(searchTerm) {
      var deferred = $q.defer();
      api.getUsers.query({ searchTerm: searchTerm },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function deleteReport(id) {
      var deferred = $q.defer();
      api.deleteReport.save({ id: id }, JSON.stringify([]),
        function (data) {
          deferred.resolve(data);
        },
        function(data) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    function deleteDetailReport(id) {
      var deferred = $q.defer();
      api.deleteDetailReport.save({ id: id }, JSON.stringify([]),
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
      searchReport: searchReport,
      getTotalReport: getTotalReport,
      deleteReport: deleteReport,
      searchAdvancedDefault: searchAdvancedDefault,
      getUnitsById: getUnitsById,
      getGroupsById: getGroupsById,
      getTypesById: getTypesById,
      getTags: getTags,
      getUsers: getUsers,
      searchAdvancedReport: searchAdvancedReport,
      searchDetailReport: searchDetailReport,
      getAreas: getAreas,
      searchDetailDefault: searchDetailDefault,
      deleteDetailReport: deleteDetailReport,
      getAllUsers:getAllUsers,
      searchHomeDefault:searchHomeDefault
    };
  }

})();