(function () {
    'use strict';

    angular
      .module('fuse')
      .factory('ReportApi', ReportApi);

    function ReportApi($resource, appConfig, $http, $window, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.ReportApi + 'api/Report'),
            getItemById: $resource(appConfig.ReportApi + 'api/Report'),
            saveItem: $resource(appConfig.ReportApi + 'api/Report'),
            updateItem: $resource(appConfig.ReportApi + 'api/Report'),
            checkKnowledged: $resource(appConfig.ReportApi + 'api/Report/CheckKnowledged?reportId=:reportId') 
        };


        function submitItem(reportId) {
            var deferred = $q.defer();
            if (reportId != null) {
                $http.post(appConfig.ReportApi + '/api/Report/Submit/' + reportId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        };

      function validateSubmitItem(reportId,tab) {
        var deferred = $q.defer();
        if (reportId != null) {
          $http.post(appConfig.ReportApi + '/api/Report/ValidateSubmit/' + reportId + "/" + tab)
            .success(function (data) {
              deferred.resolve(data);
            })
            .error(function (data) {
              deferred.reject(data);
            });
          return deferred.promise;
        }
      };

        function canKnowledged(reportId) {
            var deferred = $q.defer();
            if (reportId != null) {
                api.checkKnowledged.get({ reportId: reportId },
                  function (data) {
                      deferred.resolve(data);
                  },
                  function (data) {
                      deferred.reject(data);
                  }
                );

                return deferred.promise;
            }
        };
        function acknowledge(reportId) {
            var deferred = $q.defer();
            if (reportId != null) {
                $http.post(appConfig.ReportApi + '/api/Report/Acknowledge/' + reportId)
               .success(function (data) {
                   deferred.resolve(data);
               })
               .error(function (data) {
                   deferred.reject(data);
               }); 
               return deferred.promise;
            }
        };

        return {
            api: api,
            submitItem: submitItem,
            validateSubmitItem:validateSubmitItem,
            canKnowledged: canKnowledged,
            acknowledge: acknowledge
        };
    };
    angular
     .module('fuse')
     .factory('RPInsApi', RPInsApi);

    function RPInsApi($resource, appConfig, $http, $window, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.ReportApi + 'api/ReportProblemInstrumentation'),
            getItemById: $resource(appConfig.ReportApi + 'api/ReportProblemInstrumentation'),
            saveItem: $resource(appConfig.ReportApi + 'api/ReportProblemInstrumentation'),
            updateItem: $resource(appConfig.ReportApi + 'api/ReportProblemInstrumentation'),
            getTags: $resource(appConfig.ReportApi + '/api/Tag/Search?tagNo=:tagNo&area=:area'),
            getTypeByGroupId: $resource(appConfig.ReportApi + 'api/InstrumentationType?groupId=:groupId'),
            getTypeByGroupIds: $resource(appConfig.ReportApi + 'api/InstrumentationType/Gets',{}, {
                save: {
                    method: 'POST',
                    isArray: true
                }
            }),
            getUnitByIds: $resource(appConfig.ReportApi + 'api/Unit/Gets',{}, {
                save: {
                    method: 'POST',
                    isArray: true
                }
            }),
            getBrandTypeByBrand: $resource(appConfig.ReportApi + 'api/ReportProblemInstrumentation/GetBrandType?brandId=:brandId'),
        };
        function getItemById(reportId) {
            var deferred = $q.defer();
            var idReport = parseInt(reportId);
            if (isNaN(idReport))
                reportId = 0;
            $http.get(appConfig.ReportApi + 'api/ReportProblemInstrumentation/' + reportId)
                .success(function (data) {
                console.log(data);
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function save(reportId, dataRPIns) {
          console.log(dataRPIns);
          var deferred = $q.defer();
            if (reportId != undefined && reportId != null && reportId > 0) {
                $http.put(appConfig.ReportApi + 'api/ReportProblemInstrumentation?reportId=' + reportId, JSON.stringify(dataRPIns))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            } else {
                $http.post(appConfig.ReportApi + 'api/ReportProblemInstrumentation', JSON.stringify(dataRPIns))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            }
            return deferred.promise;
        }

        function getUnits(areaId) {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + 'api/Unit?areaId=' + areaId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function getAllUnits(areaIds) {
            var deferred = $q.defer();
            api.getUnitByIds.save({},JSON.stringify(areaIds),
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                }
              );
           
            return deferred.promise;
        }

        function getTags(tagNo,area) {
            debugger;
            var deferred = $q.defer();
            api.getTags.query({ tagNo: tagNo, area: area },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              }
            );

            return deferred.promise;
        }
        function getGroup(areaId) {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + 'api/InstrumentationGroup?areaId=' + areaId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function getBrandTypeByBrand(brandId) {
            var deferred = $q.defer();
            var _groupId = parseInt(brandId);
            if (isNaN(_groupId))
              brandId = 0;

            api.getBrandTypeByBrand.query({ brandId: brandId }, function (data) {
                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });
            return deferred.promise;
        }

      function getTypeByGroupId(groupId) {
        var deferred = $q.defer();
        var _groupId = parseInt(groupId);
        if (isNaN(_groupId))
          groupId = 0;

        api.getTypeByGroupId.query({ groupId: groupId }, function (data) {
          deferred.resolve(data);
        }, function (data) {

          deferred.reject(data);
        });
        return deferred.promise;
      }

      function getTypeByGroupIds(groupIds) {
        var deferred = $q.defer();

        api.getTypeByGroupIds.save({},JSON.stringify(groupIds), function (data) {
          deferred.resolve(data);
        }, function (data) {

          deferred.reject(data);
        });
        return deferred.promise;
      }

        return {
            api: api,
            save: save,
            getItemById: getItemById,
            getUnits: getUnits,
            getTags: getTags,
            getTypeByGroupId: getTypeByGroupId,
            getGroup: getGroup,
            getTypeByGroupIds:getTypeByGroupIds,
          getBrandTypeByBrand:getBrandTypeByBrand,
          getAllUnits:getAllUnits
        };
    };
    angular
    .module('fuse')
    .factory('ReportAttachmentApi', ReportAttachmentApi);

    function ReportAttachmentApi($resource, appConfig, $http, $window, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.ReportApi + 'api/ReportAttachment'),
            getItemById: $resource(appConfig.ReportApi + 'api/ReportAttachment'),
            saveItem: $resource(appConfig.ReportApi + 'api/ReportAttachment'),
            updateItem: $resource(appConfig.ReportApi + 'api/ReportAttachment'),
        };
        function getItemById(reportId) {
            var deferred = $q.defer();
            var idReport = parseInt(reportId);
            if (isNaN(idReport))
                reportId = 0;

            $http.get(appConfig.ReportApi + 'api/ReportAttachment/GetAll?reportId=' + reportId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function saveItem(reportId, reportAttachment) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/ReportAttachment', JSON.stringify(reportAttachment))
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        function save(reportId, reportAttachment) {
            var deferred = $q.defer();
            if (reportId != null && reportAttachment.id > 0) {
                $http.put(appConfig.ReportApi + 'api/ReportAttachment?reportId=' + reportId, JSON.stringify(reportAttachment))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            } else {
                $http.post(appConfig.ReportApi + 'api/ReportAttachment', JSON.stringify(reportAttachment))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            }
            return deferred.promise;
        }


        return {
            api: api,
            save: save,
            getItemById: getItemById
        };
    };

    /*
    ProblemApi  
   */


    /*
    ActionApi  
   */

    angular
      .module('fuse')
      .factory('ActionApi', ActionApi);

    function ActionApi($resource, appConfig, $http, $window, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.ReportApi + 'api/ReportAction'),
            getItemById: $resource(appConfig.ReportApi + 'api/ReportAction'),
            saveItem: $resource(appConfig.ReportApi + 'api/ReportAction')
        };

        function getAll() {
            var deferred = $q.defer();
            api.getAll.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getItemById(reportId) {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + 'api/ReportAction?reportId=' + reportId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function saveItem(reportId, action) {
            var deferred = $q.defer();

            if (action.workCompletionId == undefined ||
                action.workCompletionId == null ||
                action.workCompletionId == '')
                action.workCompletionId = action.old_workCompletionId;

            if (action.falureTypeId == undefined ||
                action.falureTypeId == null ||
                action.falureTypeId == '')
                action.falureTypeId = action.old_falureTypeId;

            if (action.falueSubTypeId == undefined ||
                action.falueSubTypeId == null ||
                action.falueSubTypeId == '')
                action.falueSubTypeId = action.old_falueSubTypeId;

            if (action.constraintId == undefined ||
                action.constraintId == null ||
                action.constraintId == '')
                action.constraintId = action.old_constraintId;

            if (reportId != null && action.id > 0) {
                $http.put(appConfig.ReportApi + 'api/ReportAction?reportId=' + reportId, JSON.stringify(action))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            } else {
                $http.post(appConfig.ReportApi + 'api/ReportAction', JSON.stringify(action))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                    });
            }
            return deferred.promise;
        }

        return {
            api: api,
            getItemById: getItemById,
            saveItem: saveItem
        };
    };

    /*
    IntrumentationApi  
   */




    /*
    AttachmentApi  
   */



    angular
      .module('fuse')
      .factory('AttachmentApi', AttachmentApi);

    function AttachmentApi($resource, appConfig, $http, $window, $q) {
        var $q = $q;

        var api = {
            searchdata: $resource(appConfig.ReportApi + "api/ReportAttachment/Search")
        };

        function getAll() {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + 'api/ReportAttachment?reportId=')
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        function searchAttachment(option, keyword, reportId) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.searchdata.save({
                reportId: reportId,
                keyword: keyword,
                skip: option.data.skip,
                take: option.data.take,
                sortField: sortField,
                sortDir: sortDir,
                isExport: false
            }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getItemsBy(reportId) {
            var deferred = $q.defer();
            $http.get(appConfig.ReportApi + 'api/ReportAttachment?reportId=' + reportId)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }


        function uploadFile(reportId, formdata) {
            var deferred = $q.defer();
            $http.post(appConfig.ReportApi + 'api/Attachment/Upload/' + reportId, formdata, {
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

        function downloadFile(attachmentId) {
            var deferred = $q.defer();
            //$http.get(appConfig.ReportApi + 'api/Attachment/Dowload/' + attachmentId)
            //    .success(function (data) {
            //      deferred.resolve(data);
            //    })
            //    .error(function (data) {
            //      deferred.reject(data);
            //    }); 
            xhr.send();
            return deferred.promise;
        };
        function deleteAttachment(attachmentId) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: appConfig.ReportApi + 'api/ReportAttachment/' + attachmentId,
                headers: { 'Content-type': 'application/json;charset=utf-8' }
            }).then(function (data) { deferred.resolve(data); },
                    function (data) { deferred.reject(data); });
            return deferred.promise;
        };

        return {
            api: api,
            upload: uploadFile,
            dowload: downloadFile,
            deleteAttachment: deleteAttachment,
            getItemsBy: getItemsBy,
            search: searchAttachment          
        };
    };

})();