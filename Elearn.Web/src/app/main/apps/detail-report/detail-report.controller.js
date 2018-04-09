(function () {
  'use strict';

  angular
    .module('app.detailreport')
    .controller('DetailReportController', DetailReportController);

  /** @ngInject */
  function DetailReportController($mdSidenav, $scope, $http, $state, $rootScope, $q, homeApi, $mdDialog, $timeout, $stateParams, appConfig, accountApi, DetailReportApi, RPInsApi) {
    var vm = this;
       $scope.context = $stateParams.context;
    $scope.detailreportId = ($stateParams.detailreportId != null && $stateParams.detailreportId != undefined && $stateParams.detailreportId != '') ? $stateParams.detailreportId : 0;
    $scope.canDiscard = false;
    $scope.canCreate = false;
    $scope.canDraft = false;
    $scope.canCancel = false;
    $scope.canSave = false;
    $scope.summary = {};
    $scope.isGenerateReport = false;
    $scope.isUpdate = true;
    $scope.isSearch = false;
    $scope.canExport = false;
    $scope.canExportExcel = false;
    $scope.viewMode = $scope.context.toUpperCase() === "VIEW" || $scope.context.toUpperCase() === "DETAIL";
    $scope.createMode = $scope.context.toUpperCase() === "CREATE" || ($scope.context == null || $scope.context == '');
    $scope.updateMode = $scope.context.toUpperCase() === "UPDATE";

    if ($scope.viewMode) {
      $scope.isView = true;
      $scope.isGenerateReport = true;
    }
    else if ($scope.updateMode) {
      $scope.isGenerateReport = true;
    }
    else if ($scope.createMode) {
      $scope.isSearch = true;
      $scope.canDiscard = true;
      $scope.canCreate = true;
      $scope.canDraft = true;
    }


    $scope.onUpdate = function () {
      $scope.isUpdate = true;
      $scope.detailReport.isUpdate = true;
      $scope.canSave = true;
      $scope.isView = false;
      $scope.canUpdate = false;
      $scope.canDelete = false;

      $scope.isGenerateReport = true;
      if ($scope.detailReport.status === 1) {
        $scope.canCreate = true;
      }
    };

    $scope.update = function () {
      debugger;
      var frmDetailReport = $("#frmDetailReport").kendoValidator().data("kendoValidator");
      var valid = frmDetailReport.validate();
      if (valid) {
               if($scope.detailReport != undefined && $scope.detailReport.flowCharts != undefined){
        var analysisRecomendations = _.map($scope.detailReport.flowCharts, function (item) {
          return { id: item.id, name: item.analysisRecomendation }
        });
        DetailReportApi.update($scope.detailReport.id, $scope.detailReport.analysisRecomendationSummary,$scope.detailReport.attachmentId, $scope.detailReport.hightLight, analysisRecomendations).then(function (data) {
          toastr.success('Update Successfully', 'Report');
          $scope.isView = true;
          $scope.canSave = false;
          $scope.canUpdate = true;
        }, function (data) {
          console.log(data.message);
        });
      }
      } else $scope.setFocus();
    }

    vm.allItem =
    {
      name: 'All',
      id: 0,
    };

    $scope.detailReport = {
      id: $scope.detailreportId,
      attachmentUrl: '',
      isUpdate: $scope.isUpdate,
      analysisRecomendationSummary: '',
      highlightSummary: '',
      analysisRecomendationFlow: '',
    };

    $scope.goToCancel = function () {
      $state.go('app.searchDetailReport');
    }

    DetailReportApi.getItemById($scope.detailReport.id).then(function (data) {
      $scope.detailReport = data;
           $scope.detailReport.flowCharts = data.flowCharts;
      $scope.detailReport.isSuccess = data.isSuccess;
      $scope.detailReport.summaryChart = data.summaryChart;
      $scope.detailReport.areaName = data.areaName;
      $scope.saveOn = data.saveOn;
      $scope.saveBy = data.saveBy;

      if (data.areaId && data.areaName == null) {
        DetailReportApi.getAreaTypeById(data.areaId).then(function (data) {
          $scope.detailReport.areaName = data.name;
        });
      }

      if ($scope.detailReport.id == null || $scope.detailReport.id == undefined)
        $scope.detailReport.id = $scope.detailreportId;
     
      if ($scope.createMode) {
        $scope.canDiscard = true;
        $scope.canCreate = true;
        $scope.canDraft = true;
      }
      if ($scope.viewMode) {
        $scope.canCreate = data.canCreate;
        $scope.canUpdate = data.canUpdate;
        $scope.canDelete = data.canDelete;
        $scope.canCancel = true;
          $scope.canExport = true;
          $scope.canExportExcel = true;
      }

      if ($scope.updateMode) {
        $scope.canCreate = data.canCreate;
        $scope.canSave = data.canUpdate;
        $scope.canCancel = data.canDelete;
        $scope.canExportExcel = true;
      }

      $scope.detailReport.old_areaId = $scope.detailReport.areaId;
      $scope.detailReport.old_unitId = $scope.detailReport.unitId;
      $scope.detailReport.old_groupId = $scope.detailReport.groupId;
      $scope.detailReport.old_typeId = $scope.detailReport.typeId;
      $scope.detailReport.old_subTypeId = $scope.detailReport.subTypeId;
      $scope.detailReport.isUpdate = $scope.isUpdate;

      if (data.analysisRecomendationSummary == null)
        $scope.detailReport.analysisRecomendationSummary = '';
      if (data.highlightSummary == null)
        $scope.detailReport.highlightSummary = '';
      // $scope.detailReport.areas.unshift(vm.allItem);
      //$scope.getAttachmentUrl();

    }, function (data) {
      toastr.warning(data.message, 'Report');
    });

    $scope.onValidateDate = function (e) {
      var startDate = $("#startDate").data("kendoDatePicker");
      var endDate = $("#endDate").data("kendoDatePicker");
      if (startDate.value() != null && endDate.value() != null && startDate.value() >= endDate.value()) {
        e.sender.value(null);
        toastr.warning('End date must be greater than Start date', 'Report');
      }
    };

    vm.areaSelected = [];
    vm.selectedArea = "";
    vm.areaIds = [];
    $scope.areaOptions = {
      select: function (e) {
        vm.areaSelected = e.dataItem.id + "";
        vm.selectedArea = e.dataItem.name;
        $scope.detailReport.areaId = e.dataItem.id;
        // $scope.detailReport.areaName =$scope.detailReport.areaName + "," + e.dataItem.name;
      }
    }

    $scope.onAreaChange = function (e) {
      var others = _.filter(e, function (item) { 
        return item > 3
      });

      if (others.length > 0) {
        var getSelected = _.filter(e, function (item) {
          return item == vm.areaSelected
        });
        $scope.detailReport.areaIds = getSelected;
      }
      // $scope.detailReport.units = [];
      // $scope.detailReport.groups = [];
      // $scope.detailReport.groupIds = [];
      // $scope.detailReport.subTypes = [];
      // $scope.detailReport.subTypeIds = [];
      // $scope.detailReport.types = [];
      // $scope.detailReport.typeIds = [];
      var areaId = parseInt(vm.areaSelected);
      RPInsApi.getAllUnits($scope.detailReport.areaIds).then(function (data) {
        if (data != null && data.length > 0) {
          $scope.detailReport.units = data;
          $scope.detailReport.units.unshift(vm.allItem);

          if (areaId) {
            RPInsApi.getGroup(areaId).then(function (data) {
              if (data != null && data.length > 0) {
                $scope.detailReport.groups = data;
                $scope.detailReport.groups.unshift(vm.allItem);
                $scope.detailReport.subTypes = { "data": [], "group": "" };
                $scope.detailReport.subTypeIds = [];
                $scope.detailReport.types = { "data": [], "group": "" };
                $scope.detailReport.typeIds = [];
              } else {
                $scope.detailReport.groups = [];
                $scope.detailReport.groupIds = [];
                $scope.detailReport.subTypes = [];
                $scope.detailReport.subTypeIds = [];
                $scope.detailReport.types = [];
                $scope.detailReport.typeIds = [];
              }
            }, function (data) {
              toastr.warning(data, 'Report');
            });
          }
        } else {
          $scope.detailReport.units = [];
          $scope.detailReport.groups = [];
          $scope.detailReport.groupIds = [];
          $scope.detailReport.subTypes = [];
          $scope.detailReport.subTypeIds = [];
          $scope.detailReport.types = [];
          $scope.detailReport.typeIds = [];
        }

      }, function (data) {
        toastr.warning(data, 'Report');
      });




    };

    $scope.onGroupChange = function (e) {
     if(e.length === 0){
      $scope.detailReport.types = [];
      $scope.detailReport.typeIds = [];
      $scope.detailReport.subTypes = [];
            $scope.detailReport.subTypeIds = [];
            return;
     }
     var filterAll = _.filter(e,function(item){
       return item == 0
     });

     if(filterAll != null && filterAll.length > 0){
       e = _.map($scope.detailReport.groups,function(item){
          return item.id
       });
     }

      RPInsApi.getTypeByGroupIds(e).then(function (data) {
        if (data != null && data.length > 0) {
          data.unshift({
            id: 0,
            name: "All",
            instrumentationGroupId: 0,
            groupName: ""
          });
        }else{
          $scope.detailReport.types = [];
          $scope.detailReport.typeIds = [];
        }

        $scope.detailReport.types = { "data": data, "group": "groupName" };
        $scope.detailReport.typeIds = [];
        DetailReportApi.getSubTypeByGroupIds(e).then(function (data) {
          if (data != null && data.length > 0) {
            data.unshift({
              id: 0,
              name: "All",
              instrumentationGroupId: 0,
              groupName: ""
            });

            $scope.detailReport.subTypes = { "data": data, "group": "groupName" };
            $scope.detailReport.subTypeIds = [];
          }else{
            $scope.detailReport.subTypes = [];
            $scope.detailReport.subTypeIds = [];
          }
        }, function (data) {
          toastr.warning(data, 'Report');
        });
      }, function (data) {
        toastr.warning(data, 'Report');
      });



      //if (id != null && id > 0) {
      //    $('#cboType').attr('required', 'required');
      //    $('#cboFailureType').attr('required', 'required');
      //} else {
      //    $('#cboType').removeAttr('required');
      //    $('#cboFailureType').removeAttr('required');
      //}
    };


    $scope.generateReport = function (e) {
      var frmSearchReport = $("#frmSearchReport").kendoValidator({
        rules: {
          requireField: function (input) {
            if (input.is("[ data-required-msg]")) {
              return !_.isEmpty(input.val());
            }
            return true;
          }, 
          requireDateField: function (input) {
            if (input.is("[ data-required-date-msg]")) {
              return !_.isEmpty(input.val());
            }
            return true;
          },
          dateValid: function (input) {
            if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
              var dateFormat = moment(input.val(), 'DD/MM/YYYY').format();
              var date = kendo.parseDate(dateFormat);
              var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'DD/MM/YYYY').format();
              var otherDate = kendo.parseDate(otherDateFormat);

              return otherDate.getTime() <= date.getTime();
            }
            return true;
          }
        },
        messages: {
          requireDateField: 'This field is required.',
          requireField: 'This field is required.',
          dateValid: 'End Date must greater than Start Date' 
        }
      }).data("kendoValidator");
      var valid = $scope.isView == true ? true : frmSearchReport.validate();

      if (valid) {
              var detailReport = {
          startDate: moment($scope.detailReport.startDate,"DD/MM/YYYY").format(),
          endDate:  moment($scope.detailReport.endDate,"DD/MM/YYYY").format(),
          areaIds: $scope.detailReport.areaIds,
          unitIds: $scope.detailReport.unitIds,
          groupIds: $scope.detailReport.groupIds,
          typeIds: $scope.detailReport.typeIds,
          subTypeIds: $scope.detailReport.subTypeIds
        };

        if ($scope.isGenerateReport) {
          $scope.detailReport.flowCharts = [];
          $scope.detailReport.summaryChart = {};
          $timeout(function () {
            $("#home").find("li").removeClass("active");
            $(".tab-content .tab-pane").removeClass("active");
            $(".tab-content #SummaryTab").addClass("active");
            $("#home").find("li").eq(0).addClass("active");
          }, 100)
        }

        DetailReportApi.generateChart(detailReport).then(function (data) {
          if (data.isSuccess) {
                     $scope.detailReport.flowCharts = data.flowCharts;
            $scope.detailReport.isSuccess = data.isSuccess;
            $scope.detailReport.summaryChart = data.summaryChart;
            $scope.detailReport.areaName = data.areaName;
            $scope.isGenerateReport = true;
            debugger;
            $scope.bindReport();
          } else {
            $('#errorQtyRange').modal('show');
          }

        }, function (data) {
          console.log(data);
        });


      } else
        $scope.setFocus();

    }
    $scope.bindReport = function () {
      $timeout(function () {
             var charSummary = $("#summaryChart").data("kendoChart");
        charSummary.options.categoryAxis.categories = $scope.detailReport.summaryChart.categories;
        charSummary.options.series = $scope.detailReport.summaryChart.series;
        charSummary.refresh();
        var charUnits = $("[id*='unitChart']");
        $.each(charUnits,
          function (index, elem) {
            var unitChart = $(elem).data("kendoChart");
            unitChart.options.dataSource = $scope.detailReport.summaryChart.unitsCharts;
            unitChart.refresh();
          });
       
        var getCharts = $("[id*='flowChart']");
        $.each(getCharts,
          function (index, elem) {
            var id = parseInt(elem.id.substr(9));
            var filter = _.filter($scope.detailReport.flowCharts, function (item) {
              return item.id == id;
            })
            var flowChart = $(elem).data("kendoChart");
            flowChart.options.categoryAxis.categories = filter[0].categories;
            flowChart.options.series = filter[0].series;
            flowChart.refresh();
          });
      },
        10);
    };


    $scope.onSave = function (status) {
      var file = $("#txtFileUpload").data("kendoUpload").getFiles();
      var frmDetailReport = $("#frmDetailReport").kendoValidator().data("kendoValidator");
      var valid = $scope.isView == true ? true : frmDetailReport.validate();
      if (valid) {
        $scope.detailReport.status = status;
        DetailReportApi.save($scope.detailReport).then(function (data) {
          if (parseInt(data) > 0 || JSON.parse(data) == true) {
            toastr.success('Save Successfully', 'Report');
            $timeout(function () {
              $state.go('app.searchDetailReport');
            }, 500);
          } else
            toastr.success(data, 'Report');
        }, function (data) {
          console.log(data.message);
        });

      } else{       
        $("#home").find("li").removeClass("active");
        $("#home").find("li").eq(0).addClass("active");
        $(".tab-content .tab-pane").removeClass("active");
        $(".tab-content #SummaryTab").addClass("active");
      // $scope.generateReport();
        $scope.refreshReport();
        $scope.setFocus();
      } 
    }


    $scope.onSaveDraft = function () {
        $scope.detailReport.status = 1;
        $scope.detailReport.startDate =moment($scope.detailReport.startDate,"DD/MM/YYYY").format();
        $scope.detailReport.endDate = moment($scope.detailReport.endDate,"DD/MM/YYYY").format();
        DetailReportApi.saveAsDraft($scope.detailReport).then(function (data) {
          if (parseInt(data) > 0 || JSON.parse(data) == true) {
            $scope.detailReport.id = parseInt(data);
            toastr.success('Save Successfully', 'Report');
            $timeout(function () {
              $state.go('app.searchDetailReport');
            }, 500);
          } else
            toastr.success(data, 'Report');
        }, function (data) {
          console.log(data.message);
        });
    }

    vm.tabChange = function ($event, tab) {
      var current = $event.currentTarget;
      $("#home").find("li").removeClass("active");
      $(current).parent().addClass("active");
      var newTab = tab + "Tab";
      $(".tab-content .tab-pane").removeClass("active");
      $(".tab-content #" + newTab).addClass("active");
      // $scope.generateReport();
      $scope.refreshReport();
    };

    $scope.refreshReport = function () {
      $timeout(function () {
        var charSummary = $("#summaryChart").data("kendoChart");
        charSummary.redraw();
        var charUnits = $("[id*='unitChart']");
        $.each(charUnits,
          function (index, elem) {
            var unitChart = $(elem).data("kendoChart");
            unitChart.redraw();
          });
        var getCharts = $("[id*='flowChart']");
        $.each(getCharts,
          function (index, elem) {
            var flowChart = $(elem).data("kendoChart");
            flowChart.redraw();
          });
      },
        1);
    };

    $scope.onDiscard = function(){
      $('#messageOneDetail').modal('show'); 
    }

    $scope.onConfirmMessageOne = function(e){
      $('#messageOneDetail').modal('hide'); 
      $timeout(function(){
         $state.go('app.searchDetailReport');
      },500)
    }

    $scope.onSelectFile = function (e) {
      var message = $.map(e.files, function (file) { return file.name; }).join(", ");
      var isvaild = false;
      if (e.files[0].size > 10 * 1024 * 1024) {
        toastr.warning('Maximun size per file: 10mb', 'Report');
        $(".k-upload-files.k-reset").remove();
        isvaild = true;
      }
      $.each(e.files, function (index, value) {

        var extens = [".jpeg", ".gif", ".png", ".jpg"];

        var ok = extens.some(function (el) {
          return el == value.extension.toLowerCase();
        });

        if (!ok) {
          e.preventDefault();;
          toastr.warning('Please upload image file', 'Report');
          $(".k-upload-files.k-reset").remove();
          isvaild = true;
        }
      });
      if (!isvaild) {
        //var reader = new FileReader();
        //reader.onload = function (e) {
        //    $scope.detailReport.attachmentUrl = e.target.result;
        //}
        //reader.readAsDataURL(e.files[0]);

        $scope.doUpload(e.files);
      }

      //console.log(message);
    }
    $scope.openAttachmentPopup = function () {
      if (!$scope.isView) {
        $('.nav-tabs-horizontal li').removeClass('active');
        $('input[type="file"][id$="files"]').val('');
        $('#attachmentPopup').modal('show');
      }
    }

$scope.removeImage = function(){
  $scope.detailReport.attachmentId = null;
}

    $scope.doUpload = function (files) {
      if (files.length) {
        var file = files[0];
        var formdata = new FormData();
        formdata.append('file', file.rawFile);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', appConfig.ReportApi + 'api/Attachment/UploadImage', true);
        xhr.responseType = 'text/plain';
        $scope.detailReport.isHasImage = true;
        xhr.onload = function () {
          if (this.status === 200) {
                       $scope.detailReport.imageUrl = xhr.responseText;
            var disposition = xhr.getResponseHeader('Content-Disposition');

            if (disposition && disposition.indexOf('attachmentid') !== -1) {
              var filenameRegex = /attachmentid[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              var matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1])
                $scope.detailReport.attachmentId = matches[1].replace(/['"]/g, '');
            }

            // $scope.getAttachmentUrl();
            $scope.$digest();
            $('input[type="file"][id$="files"]').val('');
            $('#attachmentPopup').modal('hide');
          }
        };
        xhr.send(formdata);
      } else
        toastr.warning('Please select a file to upload', 'Report');

    };

    function _Prevent(e) {
      e.preventDefault();
    };

    $scope.onDelete = function () {
      if (window.confirm("Would you like to delete this item?")) {
        homeApi.deleteDetailReport(parseInt($scope.detailReport.id)).then(function (data) {
          toastr.success('Delete Success', 'Report');
          $timeout(function () {
            $state.go('app.searchDetailReport');
          }, 1000);
        });
      }
    }

    $scope.Prevent = _Prevent;

    $scope.getAttachmentUrl = function () {
      if ($scope.detailReport.attachmentId != null &&
          $scope.detailReport.attachmentId > 0) {
        var xhrb = new XMLHttpRequest();
        xhrb.responseType = 'arraybuffer';
        xhrb.open('GET', appConfig.ReportApi + 'api/Attachment/Dowload/' + $scope.detailReport.attachmentId, true);
        xhrb.onreadystatechange = function () {
          if (xhrb.readyState == xhrb.DONE) {
            var blob = new Blob([xhrb.response], { type: 'jpg' });
            var URL = window.URL || window.webkitURL;
            $scope.detailReport.imageUrl = URL.createObjectURL(blob);
            $scope.$digest();
            //saveAs(blob, filename);
          }
        };
        xhrb.send();
      }
    };


    $scope.setFocus = function (value) {
      var cls = $(".k-invalid:first").attr('class');
      if (cls != null && cls != undefined && cls.indexOf('k-editor') >= 0)
        $(".k-invalid:first").data("kendoEditor").focus();
      else $(".k-invalid:first").focus();
    };

    $scope.goTo = function (value) {
      $state.go(value);
    };

    $scope.downloadExport = function () {
      try {
        if($scope.detailReport.areaIds == undefined || $scope.detailReport.areaIds.length == 0){
          toastr.warning('Please choice at least a area for export', 'Report');
            return;
        }

         var areaIds = _.map($scope.detailReport.areaIds,function(item){
           return parseInt(item);
         })

          $http.post(appConfig.ReportApi + 'api/Attachment/ExportDailyReport',areaIds,
            {
              responseType: "arraybuffer"
            }).then(function (response) {
              var myBuffer = new Uint8Array(response.data);
              var data = new Blob([myBuffer],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              var d = new Date();

              var getDate = d.getFullYear().toString() + (d.getMonth() + 1) + d.getDate();
              var fileName = getDate + "DailyReport.xlsx";
              saveAs(data, fileName);
            });
        }
      catch (e) {
        console.log(e);
      }
    };

    $scope.onExportExcel = function(){
      try {
        if(!$scope.detailReport.areaName)
          return;

          var areaNames = $scope.detailReport.areaName.split(",");
          debugger;
          $http.post(appConfig.ReportApi + 'api/Attachment/ExportDailyReportExtend',areaNames,
            {
              responseType: "arraybuffer"
            }).then(function (response) {
              var myBuffer = new Uint8Array(response.data);
              var data = new Blob([myBuffer],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              var d = new Date();

              var getDate = d.getFullYear().toString() + (d.getMonth() + 1) + d.getDate();
              var fileName = getDate + "DailyReport.xlsx";
              saveAs(data, fileName);
            });
        }
      catch (e) {
        console.log(e);
      }
    }

    $scope.visualChart = {
      visual: function(e) {
       
        var rect = new kendo.geometry.Rect(e.rect.origin, [e.rect.size.width, 100]);
          var layout = new kendo.drawing.Layout(rect, {
            orientation: "vertical",
            alignContent: "center"
          });

          if(e.text.length < 10){
            layout.append(new kendo.drawing.Text(e.text));
            layout.reflow();
            return layout;
          }
         
          var re = /_| |-|\//;
          var words = e.text.split(re);
          for (var i = 0; i < words.length; i++) {
            layout.append(new kendo.drawing.Text(words[i]));
          }
          layout.reflow();
          return layout;
      }
    }

    $scope.onExport = function () {
      // Convert the DOM element to a drawing using kendo.drawing.drawDOM
      var currMonthName  = moment().format('MMMM');
      var currentDay = moment().format('DD');
      var areaName = $scope.detailReport.areaName;
      var fullName = currentDay + ". " + currMonthName + " " + areaName + " Analysis"
      kendo.drawing.drawDOM($(".export-content"),
    {
      forcePageBreak: "#PageBreak",
      multiPage: true
    })
      .then(function (group) {
        // Render the result as a PDF file
        return kendo.drawing.exportPDF(group, {
          paperSize: "auto",
          margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
        });
      })
      .done(function (data) {
        // Save the PDF file!
        kendo.saveAs({
          dataURI: data,
          fileName: fullName + ".pdf",
          proxyURL: "http://proxy-bdc.petronas.com/proxy.pac"
        });
      });
    };
  }
})();