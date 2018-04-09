(function() {
  'use strict';

  angular
    .module('app.admintag')
    .controller('ManageTagController', ManageTagController);

  function ManageTagController($mdSidenav, $scope, $state, $timeout, $window,$http, manageTagApi,homeApi, appConfig) {

    var vm = this;
    $scope.pageSize = appConfig.pageSize;
    $scope.pageSizes = appConfig.pageSizes;

    function _showDialog() {
      $scope.Dialog = true;
      $scope.$emit('Dialog', { show: true });
    }; 

    function _hideDialog() {
      $("#report-modal span.k-tooltip-validation").hide();
      $scope.Dialog = false;
      $scope.$emit('Dialog', { show: false });
    };

    $scope.showDialog = _showDialog;
    $scope.hideDialog = _hideDialog;

    $scope.doSubmit = function () {
      var validator = $("#new-tag-form").kendoValidator({
        rules: {
          requireField: function (input) {
            if (input.is("[data-required-msg]")) {
              return !_.isEmpty(input.val());
            }
            return true;
          }
        },
        messages: {
          requireField: 'Mandatory field.'
        }
      }).data("kendoValidator");

      if (validator.validate()) {
        debugger;
        manageTagApi.doCreateTag($scope.tagNo, $scope.ecaRating, $scope.mPlan, $scope.pId, $scope.description,$scope.area.name).then(
          function(data) {
            if(data.isSuccess){
              toastr.success('Create Success', 'Report');
              $('#newTag').modal('hide');
              $('.report-grid').data('kendoGrid').dataSource.read();
              $('.report-grid').data('kendoGrid').refresh();
            }else{
              toastr.warning(data.message, 'Report');
            }
          })
      }
    };

    $scope.doCancel= function() {
      $('#newTag').modal('hide');
    }

    $scope.openCreate = function () {
      $scope.tagNo = "";
      $scope.ecaRating = { name: "Criticality Class 1" };
      $scope.mPlan= "";
      $scope.pId= "";
      $scope.description= "";
      $scope.area = { name: "All" };
    }
   
    $scope.areaOption = {
      dataTextField: "name",
      dataValueField: "name",
      dataSource: new kendo.data.DataSource({
        transport: {
          read: appConfig.ReportApi + 'api/Search/AreaTag'
        }
      })
    }

    $scope.ecaOption = {
      dataTextField: "name",
      dataValueField: "name",
      dataSource : [
        {
          name: "Criticality Class 1"
        },
        {
          name: "Criticality Class 2"
        }, {
          name: "Criticality Class 3"
        }]
    }

    //$scope.onSelectFile = function (e) {
    //  var message = $.map(e.files, function (file) { return file.name; }).join(", ");
    //  if (e.files[0].size > 10 * 1024 * 1024) {
    //    toastr.warning('Maximun size per file: 10mb', 'Report');
    //    $(".k-upload-files.k-reset").remove();
    //  }
    //  $.each(e.files, function (index, value) {

    //    var extens = [".xlsx", ".xls"];

    //    var ok = extens.some(function (el) {
    //      return el == value.extension.toLowerCase();
    //    });

    //    if (!ok) {
    //      e.preventDefault();;
    //      toastr.warning('Please upload image or data files', 'Report');
    //      $(".k-upload-files.k-reset").remove();
    //    }
    //  });
    //  //console.log(message);
    //}


    $scope.submitAttach = function () {
      var isValidFile = $(".k-file").hasClass('k-file-invalid');

      if (isValidFile) {
        return;
      }

      var file = $("#txtFileUpdate").data("kendoUpload").getFiles();
        
        if (file.length === 0) {
          toastr.warning('Please upload a file', 'Report');
          return;
        }

      $('#attachmentPopup').modal('hide');
      $('#confirmImportTag').modal('show');
    };

    $scope.submitNewAttach = function () {
      var file = $("#txtFileUpdate").data("kendoUpload").getFiles();
        
      if (file.length !== 0) {
        var fd = new FormData();
        fd.append('file', file[0].rawFile);
          manageTagApi.uploadTags(fd).then(function (data) {
            toastr.success('Upload Tag Success', 'Report');
            $('.report-grid').data('kendoGrid').dataSource.read();
            $('.report-grid').data('kendoGrid').refresh();
            $(".k-upload-files.k-reset").remove();
            $('#confirmImportTag').modal('hide');
          }, function (data) {
            $(".k-upload-files.k-reset").remove();
            $('#confirmImportTag').modal('hide');
            $('#confirmUploadError').modal('show');
          });
        }
    };

    $scope.cancelAttach = function() {
      $scope.attachment = null;
      $('input[type="file"][id$="txtFileUpdate"]').val('');
      $('#attachmentPopup').modal('hide');
    }

    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          return manageTagApi.searchTags(options, $scope.Keyword);
        },
        destroy: function (options) {
          var tagNo = options.data.models[0].tagNo;
          manageTagApi.doDeleteTag(tagNo).then(function (data) {
            toastr.success('Delete Success', 'Report');
            $('.report-grid').data('kendoGrid').dataSource.read();
            $('.report-grid').data('kendoGrid').refresh();
          });
        },
      },
      batch: true,
      serverFiltering: true,
      serverSorting: true,
      serverPaging: true,
      pageSize: $scope.pageSize,
      schema: {
        data: function (e) {
          return e.data;
        },
        total: "total",
        model: {
          id: "id",
          fields: {
            order: { type: "number" },
            tagNo: { type: "string" },
            ecaRating: { type: "string" },
            mPlan: { type: "string" },
            pid: { type: "string" },
            description: { type: "string" },
            area: { type: "string" },
            createdDate: { type: "string" },
            createdBy: { type: "string" }
          }
        }
      }
    });

    //Grid definition
    $scope.mainGridOptions = {
      pageable: {
        pageSizes: $scope.pageSizes,
        numeric: true
      },
      scrollable: false,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
      filter: true,
      selectable: true,
      //define dataBound event handler
      dataSource: $scope.gridDataSource,
      columns: [
        //define template column with checkbox and attach click event handler
        {
          field: "id",
          hidden: true,
          attributes: {
            "class": "unique-id-hidden"
          }
        },
        {
          field: "order",
          title: "No",
          width: "7%",
          template: "<strong>#:data.order#</strong>"
        },
        {
          field: "tagNo",
          title: "Tag No",
          width: "10%"
        },
        {
          field: "ecaRating",
          title: "ECA Rating",
          width: "10%"
        },
        {
          field: "mPlan",
          title: "MPlan",
          width: "15%"
        },
        {
          field: "pid",
          title: "P&ID",
          width: "10%"
        },
        {
          field: "description",
          title: "Description",
          width: "20%"
        },
        {
          field: "area",
          title: "Area",
          width: "10%"
        },
        {
          field: "createdDate",
          title: "Created Date",
          width: "10%"
        },
        {
          field: "createdBy",
          title: "Created By",
          width: "10%"
        },
        {
          command: ["edit", "destroy"],
          title: "&nbsp&nbsp&nbspAction",
          width: "15%"
        }
      ],
      editable: {
        mode: "popup",
        template: kendo.template($("#editorTemplate").html())
      },
      edit: function (e) {
        if (!e.model.isNew()) {
            e.container.kendoWindow("title", "Edit Tag");
        }
    },  
      save: function (e) {
        e.preventDefault();
        debugger;
        manageTagApi.doUpdateTag(e.model).then(function(data){
          toastr.success('Update Success', 'Report');
          $('.report-grid').data('kendoGrid').dataSource.read();
          $('.report-grid').data('kendoGrid').refresh();
        })
      }
    }

    $scope.Search = function(){
      $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    }

    $scope.downloadExport = function () {
      try {
        $http.get(appConfig.ReportApi + 'api/Attachment/ExportTag',
          {
            responseType: "arraybuffer"
          }).then(function(response) {
          var myBuffer = new Uint8Array(response.data);
          var data = new Blob([myBuffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var d = new Date();

          var getDate = d.getFullYear().toString().substring(2, 5) + (d.getMonth() + 1) + d.getDate();
          var fileName =getDate + "MPLAN Listing_Wafi.xlsx";
          saveAs(data, fileName);
        });
      }
       catch (e) {
        console.log(e);
      }
    };

    // End
  } 
})();