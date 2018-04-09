(function () {
  'use strict';

  angular
    .module('fuse')
    .factory('manageTagApi', ManageTagApi);

  /** @ngInject */
  function ManageTagApi($resource, appConfig, $http, $window, $q) {
    var $q = $q;
    var api = {
      getAllTags: $resource(appConfig.ReportApi + 'api/Admin/TagList/Search'),
      saveTag: $resource(appConfig.ReportApi + 'api/Admin/TagList/Save'),
      updateTag: $resource(appConfig.ReportApi + 'api/Admin/TagList/Update'),
      deleteTag: $resource(appConfig.ReportApi + 'api/Admin/TagList/Delete?tagNo=:tagNo'),
      exportToExcel: function() {
        return $resource(appConfig.SkillApi + 'api/Attachment/ExportTag',
          {},
          {
            get: {
              method: 'GET',
              isArray: false,
              headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              },
              responseType: 'blob',
              cache: false,
              transformResponse: function(data, headers) {
                var contentType = headers('Content-Type');
                var file = new Blob([data],
                  {
                    type: contentType
                  });
                var disposition = headers('content-disposition');
                disposition = disposition ? disposition.split(';') : [];
                var filename = disposition.length > 1 ? disposition[1].split('=')[1] : null;
                saveAs(file, filename + '.xlsx');

                // var disposition = headers('content-disposition');
                // disposition = disposition ? disposition.split(';') : [];
                // var filename = disposition.length > 1 ? disposition[1].split('=')[1] : null;
                // return {
                //     Blob: new Blob([data], { type: headers('content-type') }),
                //     Filename: filename
                // };
              }
            }
          });
      }
  };

  function searchTags(option, keyword) {
    var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
    var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";

    api.getAllTags.save(
      { },
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

  function doUpdateTag(model
  ) {
    var deferred = $q.defer();
    var tagNo = model.tagNo;
    var ecaRating = model.ecaRating;
    var mPlan = model.mPlan;
    var pid = model.pid;
    var description = model.description;
    var area = model.area;

    api.updateTag.save(
      {
        tagNo: tagNo,
        ecaRating: ecaRating,
        mplan: mPlan,
        pId: pid,
        description: description,
        area:area
      }, function (data) {
        deferred.resolve(data);
      },
      function (data) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function doDeleteTag(tagNo
  ) {
    var deferred = $q.defer();
    api.deleteTag.remove(
     {
       tagNo: tagNo
     }, JSON.stringify([])
     , function (data) {
       deferred.resolve(data);
     },
      function (data) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function doCreateTag(tagNo, ecaRating, mPlan, pId,description,area
  ) {
    var deferred = $q.defer();
    api.saveTag.save(
      {
        tagNo: tagNo,
        ecaRating: ecaRating.name,
        mPlan: mPlan,
        pId: pId,
        description: description,
        area:area
      }
      , function (data) {
        deferred.resolve(data);
      },
      function (data) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function uploadTags(formdata) {
    var deferred = $q.defer();
    $http.post(appConfig.ReportApi + 'api/Attachment/UploadTag', formdata, {
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

  function exportToExcel(){
    return api.exportToExcel().$promise;
  }

  return {
    api: api,
    searchTags: searchTags,
    doUpdateTag: doUpdateTag,
    doCreateTag: doCreateTag,
    doDeleteTag: doDeleteTag,
    uploadTags: uploadTags,
    exportToExcel: exportToExcel
  };
}
})();