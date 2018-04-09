(function () {
    'use strict';

    angular
      .module('fuse')
      .factory('masterDataApi', MasterDataApi);

    /** @ngInject */
    function MasterDataApi($resource, appConfig, $http, $window, $q) {
      var $q = $q;
        var api = {
            getAreaTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/AreaTree'),
            getWorkTypeTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/WorkTypeTree'),
            getFailureTypeTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/FailureTypeTree'),
            getConstraintTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/ContraintTree'),
            getBrandTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/BrandTree'),
            getWorkCompletionTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/WorkCompleionTree'),
            getQtyTree: $resource(appConfig.ReportApi + 'api/Admin/MasterData/QtyTree'),
            saveWorkType: $resource(appConfig.ReportApi + 'api/Admin/MasterData/WorkTypeAction'),
            saveFailureType: $resource(appConfig.ReportApi + 'api/Admin/MasterData/FailureTypeAction'),
            saveContraint: $resource(appConfig.ReportApi + 'api/Admin/MasterData/ContrainAction'),
            saveWorkCompletion: $resource(appConfig.ReportApi + 'api/Admin/MasterData/WorkCompletionAction'),
            saveGroup: $resource(appConfig.ReportApi + 'api/Admin/MasterData/GroupAction'),
            saveType: $resource(appConfig.ReportApi + 'api/Admin/MasterData/TypeAction'),
            saveBrand: $resource(appConfig.ReportApi + 'api/Admin/MasterData/SaveBrandAction'),
            saveBrandType: $resource(appConfig.ReportApi + 'api/Admin/MasterData/SaveBrandTypeAction'),
            saveSubType: $resource(appConfig.ReportApi + 'api/Admin/MasterData/SubTypeAction'),
            saveUnit: $resource(appConfig.ReportApi + 'api/Admin/MasterData/UnitAction'),
            saveArea: $resource(appConfig.ReportApi + 'api/Admin/MasterData/AreaAction'),
            saveQtyRangeApi: $resource(appConfig.ReportApi + 'api/Admin/MasterData/QtyRange'),
            deleteQtyRange: $resource(appConfig.ReportApi + 'api/Admin/MasterData/QtyRange?id=:id'),
            updateQtyNumber: $resource(appConfig.ReportApi + 'api/Admin/MasterData/Qty?id=:id&value=:value')
        };

        function getAreaTree(options) {
            api.getAreaTree.query({},
              function (data) {
                  options.success(data);
              },
              function (data) {
                  options.error(data);
              });
        }

        function getQtyTree(options) {
            api.getQtyTree.query({
            },
            function (data) {
                options.success(data);
            },
            function (data) {
                options.error(data);
            });
        }

        function saveQtyRange(request) {
        var deferred = $q.defer();
        api.saveQtyRangeApi.save({},JSON.stringify(request),
          function (data) {
            debugger;
            deferred.resolve(data);
          },
          function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

        function updateQtyNumber(id,value) {
        var deferred = $q.defer();
        api.updateQtyNumber.save({
          id: id,
          value:value
        },JSON.stringify({}),
          function (data) {
            deferred.resolve(data);
          },
          function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

      function deleteQtyRange(id) {
        var deferred = $q.defer();
        api.deleteQtyRange.delete({
            id: id
          },
          function (data) {
            deferred.resolve(data);
          },
          function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

        function saveWorkType(id, name, action) {
            var deferred = $q.defer();
            api.saveWorkType.save({
                id: id,
                name: name,
                action: action
            },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              });
            return deferred.promise;
        }

      function saveBrand(id, name, action) {
        var deferred = $q.defer();
        api.saveBrand.save({
            id: id,
            name: name,
            action: action
          },
          function (data) {
            deferred.resolve(data);
          },
          function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

      function saveBrandType(id, name,parentId, action) {
        var deferred = $q.defer();
        api.saveBrandType.save({
            id: id,
            name: name,
            parentId:parentId,
            action: action
          },
          function (data) {
            deferred.resolve(data);
          },
          function (data) {
            deferred.reject(data);
          });
        return deferred.promise;
      }

        function saveFailureType(id, name, desciption, action) {
            debugger;
            var deferred = $q.defer();
            api.saveFailureType.save({
              id: id,
              name: name,
                description: desciption,
                action: action
            },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              });
            return deferred.promise;
        }

        function saveWorkCompletion(id, name, action) {
            var deferred = $q.defer();
            api.saveWorkCompletion.save({
              id: id,
              name: name,
                action: action
            },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              });
            return deferred.promise;
        }

        function saveConstraint(id, name, action) {
            var deferred = $q.defer();
            api.saveContraint.save({
              id: id,
              name: name,
                action: action
            },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              });
            return deferred.promise;
        }

        function getWorkTypeTree() {
            var deferred = $q.defer();
            api.getWorkTypeTree.query({
            },
              function (data) {
                  deferred.resolve(data);
              },
              function (data) {
                  deferred.reject(data);
              });
            return deferred.promise;
        }

        function getWorkTypeTreeSource(options) {
            api.getWorkTypeTree.query({
            },
              function (data) {
                  options.success(data);
              },
              function (data) {
                  options.success(data);
              });
        }

        function getFaliureTypeTreeSource(options) {
            api.getFailureTypeTree.query({
            }, function (data) {
                options.success(data);
            }, function (data) {
                options.success(data);
            });
        }

        function getConstraintTreeSource(options) {
            api.getConstraintTree.query({
            }, function (data) {
                options.success(data);
            }, function (data) {
                options.success(data);
            });
        }


      function getBrandTreeSource(options) {
        api.getBrandTree.query({
        }, function (data) {
          options.success(data);
        }, function (data) {
          options.success(data);
        });
      }

        function getWorkCompletionTreeSource(options) {
            api.getWorkCompletionTree.query({
            }, function (data) {
                options.success(data);
            }, function (data) {
                options.success(data);
            });
        }

        function getSourceAreaTree() {
            var deferred = $q.defer();
            api.getAreaTree.query({
            }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }


        function saveArea(id, name, parentId, color, action, type) {
          debugger;
            var deferred = $q.defer();

            var saveData = {
                id: id,
                name: name,
                parentId: parentId,
                color:color,
                action: action,
               type:type
            }

            switch (saveData.type) {
                case "GroupRoot":
                case "Group":
                    api.saveGroup.save(JSON.stringify(saveData), function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    break;
                case "UnitRoot":
                case "Unit":
                    api.saveUnit.save(JSON.stringify(saveData), function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    break; 
                case "TypeRoot":
                case "Type":
                    api.saveType.save(JSON.stringify(saveData), function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    break;
                case "SubTypeRoot":
                case "SubType":
                    api.saveSubType.save(JSON.stringify(saveData), function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    break;
                case "Root":
                case "Area":
                default:
                    api.saveArea.save(JSON.stringify(saveData), function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    break;
            }
            return deferred.promise;
        }



        return {
            api: api,
            getAreaTree: getAreaTree,
            getSourceAreaTree: getSourceAreaTree,
            getWorkTypeTree: getWorkTypeTree,
            saveWorkType: saveWorkType,
            getWorkTypeTreeSource: getWorkTypeTreeSource,
            getQtyTree: getQtyTree,
            getBrandTreeSource:getBrandTreeSource,
            saveConstraint: saveConstraint,
            saveWorkCompletion: saveWorkCompletion,
            saveFailureType: saveFailureType,
            getWorkCompletionTreeSource: getWorkCompletionTreeSource,
            getConstraintTreeSource: getConstraintTreeSource,
            getFaliureTypeTreeSource: getFaliureTypeTreeSource,
            saveArea: saveArea,
            saveQtyRange: saveQtyRange,
            updateQtyNumber: updateQtyNumber,
            deleteQtyRange: deleteQtyRange,
            saveBrandType: saveBrandType,
            saveBrand:saveBrand
        };
    }
})();