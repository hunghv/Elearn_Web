(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('DetailReportApi', DetailReportApi);

    /** @ngInject */
    function DetailReportApi($resource, appConfig, $http, $window, $q, $anchorScroll) {
        var $q = $q;

        var api = {};
      $anchorScroll.yOffset = 10;
        function generateChart(reportDetail) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/ReportDetail/GenerateChart', JSON.stringify(reportDetail))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) { 
                        deferred.reject(data);
                    });
            return deferred.promise;
        };

        function getSubTypeByGroupIds(groupIds) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/FailureSubType/Gets', JSON.stringify(groupIds))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            return deferred.promise;
        };

      function getAreaTypeById(id) {
        var deferred = $q.defer();
        $http.get(appConfig.ReportApi + 'api/Area?id=' + id)
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

      function getItemById(reportdetailId) {
            var deferred = $q.defer();
            if (reportdetailId != null && reportdetailId != undefined && reportdetailId > 0) {
                $http.get(appConfig.ReportApi + 'api/ReportDetail/EditChart?id=' + reportdetailId)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (data) {
                            deferred.reject(data);
                        });
            } else {
                $http.get(appConfig.ReportApi + 'api/ReportDetail/' + reportdetailId)
                   .success(function (data) {
                       deferred.resolve(data);
                   })
                   .error(function (data) {
                       deferred.reject(data);
                   });
            }
            return deferred.promise;
        };

        function getSubTypes(groupId) {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + '/api/FailureSubType?groupId=' + groupId).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        function save(detailReport) {

            if (detailReport.areaId == undefined ||
                detailReport.areaId == null ||
                detailReport.areaId == '')
                detailReport.areaId = detailReport.old_areaId;

            if (detailReport.unitId == undefined ||
                detailReport.unitId == null ||
                detailReport.unitId == '')
                detailReport.unitId = detailReport.old_unitId;

            if (detailReport.groupId == undefined ||
                detailReport.groupId == null ||
                detailReport.groupId == '')
                detailReport.groupId = detailReport.old_groupId;

            if (detailReport.typeId == undefined ||
                detailReport.typeId == null ||
                detailReport.typeId == '')
                detailReport.typeId = detailReport.old_typeId;

            if (detailReport.subTypeId == undefined ||
                detailReport.subTypeId == null ||
                detailReport.subTypeId == '')
                detailReport.subTypeId = detailReport.old_subTypeId;

            detailReport.subTypeId = detailReport.failureSubTypeId;
            var deferred = $q.defer();

              $http.post(appConfig.ReportApi + 'api/ReportDetail/Create', JSON.stringify(detailReport))
                   .success(function (data) {
                       deferred.resolve(data);
                   })
                   .error(function (data) {
                       deferred.reject(data);
                   });

            return deferred.promise;
        };

        function saveAsDraft(detailReport) {

          if (detailReport.areaId == undefined ||
              detailReport.areaId == null ||
              detailReport.areaId == '')
            detailReport.areaId = detailReport.old_areaId;

          if (detailReport.unitId == undefined ||
              detailReport.unitId == null ||
              detailReport.unitId == '')
            detailReport.unitId = detailReport.old_unitId;

          if (detailReport.groupId == undefined ||
              detailReport.groupId == null ||
              detailReport.groupId == '')
            detailReport.groupId = detailReport.old_groupId;

          if (detailReport.typeId == undefined ||
              detailReport.typeId == null ||
              detailReport.typeId == '')
            detailReport.typeId = detailReport.old_typeId;

          if (detailReport.subTypeId == undefined ||
              detailReport.subTypeId == null ||
              detailReport.subTypeId == '')
            detailReport.subTypeId = detailReport.old_subTypeId;

          detailReport.subTypeId = detailReport.failureSubTypeId;
          var deferred = $q.defer();

         
          $http.post(appConfig.ReportApi + 'api/ReportDetail/SaveDraft', JSON.stringify(detailReport))
              .success(function (data) {
                deferred.resolve(data);
              })
              .error(function (data) {
                deferred.reject(data);
              });

          return deferred.promise;
        };

        function create(detailReportId) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/ReportDetail/Create?id=' + detailReportId)
                  .success(function (data) {
                      deferred.resolve(data);
                  })
                  .error(function (data) {
                      deferred.reject(data);
                  });
            return deferred.promise;
        };

        function uploadImage(reportId, formdata) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/Attachment/UploadImage', formdata, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (data, status, headers) {
                deferred.resolve(headers);
            })
            .error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
          
        function update(id, analysisRecomendationSummary,attachmentId, hightLight,analysisRecomendations) {
          var deferred = $q.defer();
          $http.post(appConfig.ReportApi + 'api/ReportDetail/Update',
              {
                id: id,
                               analysisRecomendationSummary: analysisRecomendationSummary,
                               attachmentId:parseInt(attachmentId),
                hightLight: hightLight,
                analysisRecomendations:analysisRecomendations
              })
            .success(function (data, status, headers) {
              deferred.resolve(headers);
            })
            .error(function (data) {
              deferred.reject(data);
            });
          return deferred.promise;
        }

        return {
            api: api,
            generateChart: generateChart,
            getItemById: getItemById,
            getSubTypes: getSubTypes,
            save: save,
            uploadImage: uploadImage,
            create: create,
            update: update,
            saveAsDraft: saveAsDraft,
            getAreaTypeById: getAreaTypeById,
            getSubTypeByGroupIds:getSubTypeByGroupIds
        };
    }

})();