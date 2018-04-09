(function () {
  'use strict';

  angular
    .module('app.createdailyreport')
    .controller('CreateDailyReportController', CreateDailyReportController);

  /** @ngInject */
  function CreateDailyReportController($mdSidenav, $scope, $state,$http, $rootScope, $q, homeApi, $mdDialog, $timeout, $stateParams, appConfig, ActionApi, RPInsApi, AttachmentApi, ReportApi, ReportAttachmentApi, accountApi) {
    var vm = this;
    var initScope = function () {
      vm.isSubmit = false;
      $scope.problemIntrumentation = [];
      $scope.action = [];
      $scope.status = '';
      $scope.customFullscreen = false;
      $scope.pageSize = 10;
      $scope.reportId = $stateParams.reportId;
      $scope.context = $stateParams.context;
      console.log($stateParams.reportId);
      $scope.isView = false;

      $scope.attachmentIds = [];
      $scope.reportAttachmentId = 0;
      $scope.canDraft = false; 
      $scope.canSubmit = false;
      $scope.canDiscard = false;
      $scope.canSave = false;
      $scope.canUpdate = false;
      $scope.canDelete = false;
      $scope.canCancel = false;
      $scope.canAcknowledged = false;
      $scope.viewMode = $scope.context.toUpperCase() === "VIEW";
      $scope.createMode = $scope.context.toUpperCase() === "CREATE";
      $scope.updateMode = $scope.context.toUpperCase() === "UPDATE";
    }

    initScope();

    var initDdlSource = function () {
      $scope.areaOptions = {
        dataTextField: "name",
        dataValueField: "id",
        select: function(e){
          $scope.problemIntrumentation.areaName = e.dataItem.name;
        },
        change: function (e) {
          var id = $scope.problemIntrumentation.areaId;
          RPInsApi.getUnits(id).then(function (data) {
            $scope.unitDdl.setDataSource(new kendo.data.DataSource({
              data: {
                'units': data
              },
              schema: {
                data: 'units'
              }
            }));
            $scope.typeDdl.setDataSource(new kendo.data.DataSource({
              data: {
                'types': []
              },
              schema: {
                data: 'types'
              }
            }));
          },
            function (data) {
              toastr.warning(data, 'Report');
            });

          RPInsApi.getGroup(id).then(function (data) {
            $scope.groupDdl.setDataSource(new kendo.data.DataSource({
              data: {
                'groups': data
              },
              schema: {
                data: 'groups'
              }
            }));
          },
            function (data) {
              // toastr.warning(data, 'Report');
              toastr.warning(data, 'Report');
            });
        },
        dataSource: new kendo.data.DataSource({
          data: {
            'areas': []
          },
          schema: {
            data: 'areas'
          }
        })
      }

      $scope.unitOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'units': []
          },
          schema: {
            data: 'units'
          }
        })
      }

      $scope.groupOptions = {
        dataTextField: "name",
        dataValueField: "id",
        change: function (e) {
          var id = $scope.problemIntrumentation.instrumentationGroupId;
          RPInsApi.getTypeByGroupId(id).then(function (data) {
            $scope.typeDdl.setDataSource(new kendo.data.DataSource({
              data: {
                'types': data
              },
              schema: {
                data: 'types'
              }
            }));
          },
            function (data) {
              toastr.warning(data, 'Report');
            });
        },
        dataSource: new kendo.data.DataSource({
          data: {
            'groups': []
          },
          schema: {
            data: 'groups'
          }
        })
      }

      $scope.typeOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'types': []
          },
          schema: {
            data: 'types'
          }
        })
      }

      $scope.brandOptions = {
        dataTextField: "name",
        dataValueField: "id",
        change: function (e) {
          var id = $scope.problemIntrumentation.brandId;
          RPInsApi.getBrandTypeByBrand(id).then(function (data) {
            $scope.brandTypeDdl.setDataSource(new kendo.data.DataSource({
              data: {
                'brandTypes': data
              },
              schema: {
                data: 'brandTypes'
              }
            }));
          },
            function (data) {
              toastr.warning(data, 'Report');
            });
          if ($scope.problemIntrumentation.brandId !== 3)
            $scope.canShowOtherBrand = false;
        },
        dataSource: new kendo.data.DataSource({
          data: {
            'brands': []
          },
          schema: {
            data: 'brands'
          }
        })
      }

      $scope.brandTypeOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'brandTypes': []
          },
          schema: {
            data: 'brandTypes'
          }
        })
      }

      $scope.workCompletionChange = function (e) {
        if ($scope.action.workCompletionId === 1) {
          $scope.isConstraintView = true;
          $("#TabAction span.k-tooltip-validation").hide();
        } else {
          $scope.isConstraintView = false;
        }
      };

      $scope.brandTypeOnChange = function (e) {
        if ($scope.problemIntrumentation.brandId == 3) {
          if (e.dataItem.name === 'Others')
            $scope.canShowOtherBrand = true;
          else {
            $scope.canShowOtherBrand = false;
          }
        } else {
          $scope.problemIntrumentation.otherBrand = "";
          $scope.canShowOtherBrand = false;
        }
      };

      $scope.workTypeOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'workTypes': []
          },
          schema: {
            data: 'workTypes'
          }
        })
      }

      $scope.failureTypeOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'failureTypes': []
          },
          schema: {
            data: 'failureTypes'
          }
        })
      }

      //$scope.failureTypeChange = function (e) {
      //  if (e.dataItem.id !== 1)
      //    $('#cboFailureSubType').attr('required', 'required');
      //  else {
      //    $('#cboFailureSubType').removeAttr('required');
      //    $('#spFailureSubType').hide();
      //  }
      //}

      $scope.failureSubTypeOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'failureSubTypes': []
          },
          schema: {
            data: 'failureSubTypes'
          }
        })
      }

      $scope.constraintsOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: new kendo.data.DataSource({
          data: {
            'constraints': []
          },
          schema: {
            data: 'constraints'
          }
        })
      }
    }

    initDdlSource();

    // AutoSuggest Tag No
    $scope.problemAutoCompTagNo = {
      dataTextField: 'tagNo',
      filter: "contains",
      minLength:2,
      delay: 500,
      change: function (e) {
        var selectTagNo = $scope.problemIntrumentation.tagNo;
        if (selectTagNo == undefined) {
          $scope.problemIntrumentation.ecaRating = "";
          $scope.problemIntrumentation.pid = "";
          $scope.problemIntrumentation.mplan = "";
        }
      },
      dataSource: new kendo.data.DataSource({
        serverFiltering: true,
        transport: {
          read: function (options) {
            return RPInsApi.getTags($scope.problemIntrumentation.tagNo,$scope.problemIntrumentation.areaName).then(function (data) {
              options.success(data);
            }, function (data) { toastr.warning(data, 'Report'); });
          }
        }
      }),
      select: function (selected) {
        if (selected != undefined) {
          $scope.problemIntrumentation.ecaRating = selected.dataItem.ecaRating;
          $scope.problemIntrumentation.pid = selected.dataItem.pid;
          $scope.problemIntrumentation.mplan = selected.dataItem.mPlan;
        }
      }
    };

    // activate tab  
    $scope.activateTab = function (newTab, isSubmit) {

      // View Mode
      if ($scope.isView) {
        $scope.loadTag(newTab, isSubmit);
        return true;
      }

      var isValidate = true;
      if ($scope.currentTab !== newTab) {
        switch ($scope.currentTab) {
          case 'Action':
            if ($scope.action != null) {
              $scope.action.falureTypeId = $scope.action.falureTypeId == undefined ? 0 : $scope.action.falureTypeId;
              $scope.action.falueSubTypeId = $scope.action.falueSubTypeId == undefined ? 0 : $scope.action.falueSubTypeId;
              $scope.action.workCompletionId = $scope.action.workCompletionId == undefined ? 0 : $scope.action.workCompletionId;
              $scope.action.constraintId = $scope.action.constraintId == undefined ? 0 : $scope.action.constraintId;
              ActionApi.saveItem($scope.reportId, $scope.action).then(function (data) {
                $scope.action.id = data.id;
                $scope.reportId = data.reportId;
                $scope.loadTag(newTab, isSubmit);

              }, function (data) {
                isValidate = false;
                toastr.warning(data.message, 'Report');
              });
            }
            break;
          case 'Attachment':
            $scope.loadTag(newTab, isSubmit);
            break;
          case 'ProblemIntrumentation':
            var validator = $("#frmProblemIntrumentation").kendoValidator({
              rules: {
                requireField: function (input) {
                  if (input.is("[ data-required-tag-msg]")) {
                    return !_.isEmpty(input.val());
                  }
                  return true;
                }, 
                dateValid: function (input) {
                  if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
                    var dateFormat = moment(input.val(), 'M/D/YYYY').format();
                    var date = new Date(dateFormat);
                    var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'M/D/YYYY').format();
                    var otherDate = new Date(otherDateFormat);

                    return otherDate.getTime() <= date.getTime();
                  }
                  return true;
                }
              },
              messages: {
                requireField: 'This field is required.',
                dateValid: 'End Date must greater than Start Date'
              }
            }).data("kendoValidator");

            if (validator.validate()) {
              if ($scope.problemIntrumentation != null) {
                               RPInsApi.save($scope.reportId, $scope.problemIntrumentation).then(function (data) {
                  $scope.reportId = data.reportId;
                  $scope.loadTag(newTab, isSubmit);
                  $state.transitionTo($state.current,
                    { reportId: data.reportId, context: $scope.context },
                    {
                      reload: false,
                      inherit: false,
                      notify: false
                    });
                },
                  function (data) { toastr.warning(data.message, 'Report'); });
              }
            } else isValidate = false;
            break;
        }
      }

      if (!isValidate) {
        $timeout(function () {
          $('.nav-tabs-horizontal li').removeClass('active');
          $('.nav-tabs-horizontal li#' + $scope.currentTab.toLowerCase() + '-item').addClass('active');
        }, 500);
      }

      return isValidate;
    };

    $scope.loadTag = function (newTab, isSubmit) {
      if (isSubmit != true) {
        $scope.isView = $scope.viewMode && !$scope.canSave;
        switch (newTab) {
          case 'Action':
            ActionApi.getItemById($scope.reportId).then(function (data) {

              if (data.failureTypes) {
                $scope.ddlFailureType.setDataSource(new kendo.data.DataSource({
                  data: {
                    'failureTypes': data.failureTypes
                  },
                  schema: {
                    data: 'failureTypes'
                  }
                }));
              }

              if (data.failureSubTypes) {
                $scope.ddlFailureSubType.setDataSource(new kendo.data.DataSource({
                  data: {
                    'failureSubTypes': data.failureSubTypes
                  },
                  schema: {
                    data: 'failureSubTypes'
                  }
                }));
              }

              if (data.constraints) {
                $scope.ddlConstraint.setDataSource(new kendo.data.DataSource({
                  data: {
                    'constraints': data.constraints
                  },
                  schema: {
                    data: 'constraints'
                  }
                }));
              }

              $scope.action = data;
              $scope.reportId = data.reportId;
              $scope.Status = data.status;
              $scope.saveOn = data.saveOn;
              $scope.saveBy = data.saveBy;
              vm.isSubmit = data.canSubmit;

              if (data.status === "Draft") {
                if ($scope.createMode) {
                  $scope.canDraft = true;
                  $scope.canDiscard = true;
                }

                $scope.canSubmit = data.canSubmit;
              }

              if ($scope.viewMode) {
                if (data.status === "New") {
                  $scope.canAcknowledged = data.canAcknowledge;
                }

                $scope.canUpdate = data.canUpdate && !$scope.canSave;
                $scope.canDelete = data.canDelete;
              }

              if ($scope.updateMode) {
                $scope.canSave = data.canUpdate;
                $scope.isView = !data.canUpdate;
                $scope.canCancel = true;
                if (data.status === "New") {
                  $scope.canAcknowledged = data.canAcknowledge;
                }
              }

              if ($scope.action.workCompletionId === 1) {
                $scope.isConstraintView = true;
              } else {
                $scope.isConstraintView = false;
              }

            }, function (data) { toastr.warning(data.message, 'Report'); });
            break;
          case 'Attachment':
            if ($scope.attachment == null || $scope.attachment == '' || $scope.attachment == undefined) {
              $scope.attachment = {};
              $scope.attachment.reportId = $scope.reportId;

            }
            $scope.loadAttachment();

            ReportAttachmentApi.getItemById($scope.reportId).then(function (data) {
              $scope.Status = data.status;
              vm.isSubmit = data.canSubmit;
              if (data.status === "Draft") {
                if ($scope.createMode) {
                  $scope.canDraft = true;
                  $scope.canDiscard = true;
                }

                $scope.canSubmit = data.canSubmit;
              }

              if ($scope.viewMode) {
                if (data.status === "New") {
                  $scope.canAcknowledged = data.canAcknowledge;
                }

                $scope.canUpdate = data.canUpdate && !$scope.canSave;
                $scope.canDelete = data.canDelete;
              }

              if ($scope.updateMode) {
                $scope.canSave = data.canUpdate;
                $scope.isView = !data.canUpdate;
                $scope.canCancel = true;
                if (data.status === "New") {
                  $scope.canAcknowledged = data.canAcknowledge;
                }
              }

              $scope.reportAttachmentId = data.id;
            }, function (data) { toastr.warning(data.message, 'Report'); });

            break;
          case 'ProblemIntrumentation':
            RPInsApi.getItemById($scope.reportId).then(function (data) {
              debugger;
              if (data.areas) {
                $scope.areaDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'areas': data.areas
                  },
                  schema: {
                    data: 'areas'
                  }
                }));
              }

              if (data.units) {
                $scope.unitDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'units': data.units
                  },
                  schema: {
                    data: 'units'
                  }
                }));
              }

              if (data.brands) {
                $scope.brandDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'brands': data.brands
                  },
                  schema: {
                    data: 'brands'
                  }
                }));
              }

              if (data.brandTypes) {
                $scope.brandTypeDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'brandTypes': data.brandTypes
                  },
                  schema: {
                    data: 'brandTypes'
                  }
                }));
              }

              if (data.instrumentationGroups) {
                $scope.groupDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'groups': data.instrumentationGroups
                  },
                  schema: {
                    data: 'groups'
                  }
                }));
              }

              if (data.instrumentationTypes) {
                $scope.typeDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'types': data.instrumentationTypes
                  },
                  schema: {
                    data: 'types'
                  }
                }));
              }

              if (data.workTypes) {
                $scope.workTypeDdl.setDataSource(new kendo.data.DataSource({
                  data: {
                    'workTypes': data.workTypes
                  },
                  schema: {
                    data: 'workTypes'
                  }
                }));
              }

              $scope.problemIntrumentation = data;
              $scope.Status = data.status;
              $scope.saveOn = data.saveOn;
              $scope.saveBy = data.saveBy;
              vm.isSubmit = data.canSubmit;
               
              if (data.status === "Draft") {
                if ($scope.createMode) {
                  $scope.canDraft = true;
                  $scope.canDiscard = true;
                }

                $scope.canSubmit = data.canSubmit;
              }

              if ($scope.viewMode) {
                $scope.canAcknowledged = data.canAcknowledge;
                $scope.canUpdate = data.canUpdate && !$scope.canSave;
                $scope.canDelete = data.canDelete;
              }

              if ($scope.updateMode) {
                $scope.canSave = data.canUpdate;
                $scope.isView = !data.canUpdate;
                $scope.canCancel = true;
                if (data.status === "New") {
                  $scope.canAcknowledged = data.canAcknowledge;
                }
              }

            }, function (data) { toastr.warning(data.message, 'Report'); });


            break;
        }
        $scope.currentTab = newTab;
        $('.create-daily-report .tab-pane').removeClass('active');
        $('.create-daily-report #Tab' + newTab).addClass('active');

        $timeout(function () {
          $('.nav-tabs-horizontal li').removeClass('active');
          $('.nav-tabs-horizontal li#' + $scope.currentTab.toLowerCase() + '-item').addClass('active');
        }, 500);

      }
    };


    // attachment  
    $scope.mainGridOptions = {
      pageable: {
        pageSizes: [10, 30, 40, 50],
        numeric: true
      },
      scrollable: false,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
      filter: true,
      selectable: true,
      dataSource: new kendo.data.DataSource({
        transport: {
          read: function (options) {
            return AttachmentApi.search(options, $scope.keyword, $scope.reportId);
          }
        },
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
              id: { type: "number" },
              reportId: { type: "number" },
              remark: { type: "string" },
              attachmentLength: { type: "number" },
              attachmentName: { type: "string" },
              attachmentType: { type: "string" },
              urlDowload: { type: "string" },
            }
          }
        }
      }),
      columns: [{
        field: "attachmentName",
        title: "File Name",
        width: "180px",
        template: "<a id='#= data.id#' ng-click='downloadAttachment(this)'  class='attachment-item'>#= data.attachmentName# </a>"
      }, {
        field: "remark",
        title: "Remark",
        template: function (item) {
          debugger;
          var result = item.remark == "undefined" ? "" : item.remark;
          return result;
        }
      }, {
        field: "id",
        title: " ",
        width: "80px",
        template: function () {
          return $scope.isView ? "" : "<a id='#= data.id#'  ng-click='deleteAttachment(this)' class='attachment-item'>Delete</a>";
        }
      }]
    };

    $scope.deleteAttachment = function (e) {
      if (window.confirm("Would you like to delete this item?")) {
        AttachmentApi.deleteAttachment(e.dataItem.id).then(function (data) {
          $scope.loadAttachment();
        }, function (data) {
          toastr.warning(data.statusText + ' : ' + data.status, 'Report');
        });
      }
    };

    $scope.downloadAttachment = function (e) {
      try {
        var item = e.dataItem;
        $http.get(item.urlDowload,
          {
            responseType: "arraybuffer"
          }).then(function(response) {
          var myBuffer = new Uint8Array(response.data);
          var data = new Blob([myBuffer],
            { type: item.attachmentType });
        
          saveAs(data, item.attachmentName);
        });
      }
      catch (e) {
        console.log(e);
      }
    };
     
    $scope.loadAttachment = function () {
      $scope.mainGridOptions.dataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    };

    $scope.onSelectFile = function (e) {
      var message = $.map(e.files, function (file) { return file.name; }).join(", ");
      if (e.files[0].size > 10 * 1024 * 1024) {
        toastr.warning('Maximun size per file: 10mb', 'Report');
        $(".k-upload-files.k-reset").remove();
      }
      $.each(e.files, function (index, value) {

        var extens = [".pdf", ".ppt", ".pptx", ".xlsx", ".xls", ".doc", ".docx", ".jpeg", ".gif", ".png", ".tif", ".jpg"];

        var ok = extens.some(function (el) {
          return el == value.extension.toLowerCase();
        });

        if (!ok) {
          e.preventDefault();;
          toastr.warning('Please upload image or data files', 'Report');
          $(".k-upload-files.k-reset").remove();
        }
      });
      //console.log(message);
    }

    $scope.doSubmit = function (isSubmit) {
      if (isSubmit == 'Submit') {
        var isValidFile = $(".k-file").hasClass('k-file-invalid');

        if (isValidFile) {
          return;
        }
        var file = $("#txtFileUpdate").data("kendoUpload").getFiles();
        if (file.length !== 0) {
          var fd = new FormData();
          fd.append('file', file[0].rawFile);
          fd.append('Remark', $scope.attachment.Remark);

          AttachmentApi.upload($scope.reportId, fd).then(function (data) {
            $scope.loadAttachment();
            $scope.attachment = null;
            $(".k-upload-files.k-reset").remove();
            $('#attachmentPopup').modal('hide');
          },
            function (data) {
              toastr.warning(data.message, 'Report');
            });
        } else {
          toastr.warning("Please upload a valid file", 'Report');
        }
      }
      else {
        $scope.attachment = null;
        $('input[type="file"][id$="files"]').val('');
        $('#attachmentPopup').modal('hide');
      }
    };


    $scope.getBrandTypeSource = function (brandId) {
      RPInsApi.getBrandTypeByBrand(brandId).then(function (data) {
        $scope.problemIntrumentation.brandTypes = data;
      });
      $scope.canShowOtherBrand = false;
      $scope.problemIntrumentation.otherBrand = "";
    }

    // button action
    $scope.goToDelete = function () {
      if (window.confirm("Would you like to delete this item?")) {
        homeApi.deleteReport($scope.reportId).then(function (data) {
          $state.go('app.home.all');
        });
      }
    }

    $scope.doUpdate = function () {
      $scope.canUpdate = false;
      $scope.isView = false;
      $scope.canSave = true;
      //$scope.doEnableDropdownList(true);
      //$('#gdAttachment').data('kendoGrid').dataSource.read();
      $('#gdAttachment').data('kendoGrid').refresh();
    };

    $scope.doEnableDropdownList = function (isEnable) {
      var areaDropDownlist = $("#cboArea").data("kendoDropDownList");
      areaDropDownlist.enable(isEnable);
      var unitDropDownlist = $("#cboUnit").data("kendoDropDownList");
      unitDropDownlist.enable(isEnable);
      var groupDropDownlist = $("#cboGroup").data("kendoDropDownList");
      groupDropDownlist.enable(isEnable);
      var typeDropDownlist = $("#cboType").data("kendoDropDownList");
      typeDropDownlist.enable(isEnable);
      var worktypeDropDownlist = $("#cboWorkType").data("kendoDropDownList");
      worktypeDropDownlist.enable(isEnable);
      var cboFailureType = $("#cboFailureType").data("kendoDropDownList");
      cboFailureType.enable(isEnable);
      var cboFailureSubType = $("#cboFailureSubType").data("kendoDropDownList");
      cboFailureSubType.enable(isEnable);
    }

    $scope.goToSave = function () {
      switch ($scope.currentTab) {
        case 'Action':
          if ($scope.action != null) {
            $scope.action.falureTypeId = $scope.action.falureTypeId == undefined ? 0 : $scope.action.falureTypeId;
            $scope.action.falueSubTypeId = $scope.action.falueSubTypeId == undefined ? 0 : $scope.action.falueSubTypeId;
            $scope.action.workCompletionId = $scope.action.workCompletionId == undefined ? 0 : $scope.action.workCompletionId;
            $scope.action.constraintId = $scope.action.constraintId == undefined ? 0 : $scope.action.constraintId;
            debugger;
            ActionApi.saveItem($scope.reportId, $scope.action).then(function (data) {
              $scope.action.id = data.id;
              toastr.success('Save Successfully', 'Report');
              $timeout(function () {
                if ($scope.viewMode === true) {
                  $scope.canUpdate = true;
                  $scope.isView = true;
                  $scope.canSave = false;
                }

                //if ($scope.currentTab === 'Attachment')
                //  $('#gdAttachment').data('kendoGrid').refresh();
                //$scope.doEnableDropdownList(false);
              }, 100);

            }, function (data) { toastr.warning(data.message, 'Report'); });
          }
          break;
        case 'Attachment':
          toastr.success('Save Successfully', 'Report');
          $timeout(function () {
            if ($scope.viewMode === true) {
              $scope.canUpdate = true;
              $scope.isView = true;
              $scope.canSave = false;
            }

            //if ($scope.currentTab === 'Attachment')
            //  $('#gdAttachment').data('kendoGrid').refresh();
            //$scope.doEnableDropdownList(false);
          }, 100);
          break;
        case 'ProblemIntrumentation':
          if ($scope.problemIntrumentation != null) {
            var validator = $("#frmProblemIntrumentation").kendoValidator({
              rules: {
                requireField: function (input) {
                  if (input.is("[ data-required-tag-msg]")) {
                    return !_.isEmpty(input.val());
                  }
                  return true;
                },
                dateValid: function (input) {
                  if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
                    var dateFormat = moment(input.val(), 'M/D/YYYY').format();
                    var date = kendo.parseDate(dateFormat);
                    var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'M/D/YYYY').format();
                    var otherDate = kendo.parseDate(otherDateFormat);

                    return otherDate.getTime() <= date.getTime();
                  }
                  return true;
                }
              },
              messages: {
                requireField: 'This field is required.',
                dateValid: 'End Date must greater than Start Date'
              }
            }).data("kendoValidator");

            if (validator.validate()) {
              RPInsApi.save($scope.reportId, $scope.problemIntrumentation).then(function (data) {
                toastr.success('Save Successfully', 'Report');
                $timeout(function () {
                  if ($scope.viewMode === true) {
                    $scope.canUpdate = true;
                    $scope.isView = true;
                    $scope.canSave = false;
                  }

                  //if ($scope.currentTab === 'Attachment')
                  //  $('#gdAttachment').data('kendoGrid').refresh();
                  //$scope.doEnableDropdownList(false);
                }, 100);
              }, function (data) { toastr.warning(data.message, 'Report'); });
            }
          }
          break;
      }
    }

    $scope.onDiscard = function(){
      $('#messageOneDetail').modal('show'); 
    }

    $scope.onConfirmMessageOne = function(e){
      $('#messageOneDetail').modal('hide'); 
      $timeout(function(){
         $state.go('app.home');
      },500)
    }

    $scope.goToSaveDraft = function () {
      switch ($scope.currentTab) {
        case 'Action':
          if ($scope.action != null) {
            $scope.action.falureTypeId = $scope.action.falureTypeId == undefined ? 0 : $scope.action.falureTypeId;
            $scope.action.falueSubTypeId = $scope.action.falueSubTypeId == undefined ? 0 : $scope.action.falueSubTypeId;
            $scope.action.workCompletionId = $scope.action.workCompletionId == undefined ? 0 : $scope.action.workCompletionId;
            $scope.action.constraintId = $scope.action.constraintId == undefined ? 0 : $scope.action.constraintId;
            ActionApi.saveItem($scope.reportId, $scope.action).then(function (data) {
              $scope.action.id = data.id;
              toastr.success('Save Successfully', 'Report');
              $state.go("app.home.all");

            }, function (data) { toastr.warning(data.message, 'Report'); });
          }
          break;
        case 'Attachment':
          toastr.success('Save Successfully', 'Report');
          $state.go("app.home.all");
          break;
        case 'ProblemIntrumentation':
          if ($scope.problemIntrumentation != null) {
            var validator = $("#frmProblemIntrumentation").kendoValidator({
              rules: {
                requireField: function (input) {
                  if (input.is("[ data-required-tag-msg]")) {
                    return !_.isEmpty(input.val());
                  }
                  return true;
                },
                dateValid: function (input) {
                  if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
                    var dateFormat = moment(input.val(), 'M/D/YYYY').format();
                    var date = kendo.parseDate(dateFormat);
                    var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'M/D/YYYY').format();
                    var otherDate = kendo.parseDate(otherDateFormat);

                    return otherDate.getTime() <= date.getTime();
                  }
                  return true;
                }
              },
              messages: {
                requireField: 'This field is required.',
                dateValid: 'End Date must greater than Start Date'
              }
            }).data("kendoValidator");

            if (validator.validate()) {
              RPInsApi.save($scope.reportId, $scope.problemIntrumentation).then(function (data) {
                toastr.success('Save Successfully', 'Report');
                $state.go("app.home.all");
              }, function (data) { toastr.warning(data.message, 'Report'); });
            }
          }
          break;
      }


    }

    $scope.goToCancel = function () {
      $state.go("app.home.all");
    }
    $scope.goTo = function (value) {
      if (value == 'submit') {
        switch ($scope.currentTab) {
          case 'Action':
            if ($scope.action != null) {
              var validator = $("#frmAction").kendoValidator({
                rules: {
                  requireWork: function (input) {
                    if (input.filter("[type=radio]") && input.attr("required")) {
                      return $("#frmAction").find("[type=radio]").is(":checked");
                    }
                    return true;
                  },
                  requireField: function (input) {
                    if (input.is("[data-required-msg]") || input.is("[ data-required-tag-msg]")) {
                      return !_.isEmpty(input.val());
                    }
                    return true;
                  },
                  requireConstraint: function (input) {
                    if (input.is("[data-required-msg]")) {
                      return !_.isEmpty(input.val()) || $scope.action.workCompletionId !== 1;
                    }
                    return true;
                  },
                  requireFailureSubType: function (input) {
                    if (input.is("[data-required-failuresubtype-msg]")) {
                      debugger;
                      return !_.isEmpty(input.val()) || $scope.action.falureTypeId == 1;
                    }
                    return true;
                  }
                },
                messages: {
                  requireWork: 'This field is required.',
                  requireConstraint: 'This field is required.',
                  requireFailureSubType: 'This field is required.',
                  requireField: 'This field is required.'
                }
              }).data("kendoValidator");

              if (validator.validate()) {

                ActionApi.saveItem($scope.reportId, $scope.action).then(function (data) {
                  $scope.action.id = data.id;
                  $scope.reportId = data.reportId;
                 ReportApi.validateSubmitItem($scope.reportId, $scope.currentTab).then(function(res) {
                    if (res.length > 0) {
                      $scope.errors = res;
                      $('#errorSubmit').modal('show');
                    } else {
                      ReportApi.submitItem($scope.reportId).then(function (data) {
                        if (data.isSuccess) {
                          toastr.success('submit successfully', 'Report');
                          $timeout(function () {
                            $state.go('app.home.all');
                          }, 100);
                        } else {
                          toastr.warning("Submit Errors", 'Report');
                        }
                      }, function (data) { toastr.warning(data, 'Report'); });
                    }
                  });

                }, function (data) { toastr.warning(data.message, 'Report'); });
              }
            }
            break;
          case 'Attachment':
            ReportApi.validateSubmitItem($scope.reportId, $scope.currentTab).then(function (res) {
              if (res.length > 0) {
                $scope.errors = res;
                      $('#errorSubmit').modal('show');
              } else {
                ReportApi.submitItem($scope.reportId).then(function (data) {
                  if (data.isSuccess) {
                    toastr.success('submit successfully', 'Report');
                    $timeout(function () {
                      $state.go('app.home.all');
                    }, 100);
                  } else {
                    toastr.warning("Submit Errors", 'Report');
                  }
                }, function (data) { toastr.warning(data, 'Report'); });
              }
            });
            break;
          case 'ProblemIntrumentation':
            if ($scope.problemIntrumentation != null) {
              var validator = $("#frmProblemIntrumentation").kendoValidator({
                rules: {
                  requireField: function (input) {
                    if (input.is("[data-required-msg]") || input.is("[ data-required-tag-msg]")) {
                      return !_.isEmpty(input.val());
                    }
                    return true;
                  },
                  dateValid: function (input) {
                    if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
                      var dateFormat = moment(input.val(), 'M/D/YYYY').format();
                      var date = kendo.parseDate(dateFormat);
                      var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'M/D/YYYY').format();
                      var otherDate = kendo.parseDate(otherDateFormat);

                      return otherDate.getTime() <= date.getTime();
                    }
                    return true;
                  }
                },
                messages: {
                  requireField: 'This field is required.',
                  dateValid: 'End Date must greater than Start Date'
                }
              }).data("kendoValidator");
              if (validator.validate()) {
                RPInsApi.save($scope.reportId, $scope.problemIntrumentation).then(function (data) {
                  // $scope.problemIntrumentation = data;
                  $scope.reportId = data.reportId;
                  ReportApi.validateSubmitItem($scope.reportId, $scope.currentTab).then(function(res) {
                    if (res.length > 0) {
                      $scope.errors = res;
                      $('#errorSubmit').modal('show');
                    } else {
                      ReportApi.submitItem($scope.reportId).then(function (data) {
                        if (data.isSuccess) {
                          toastr.success('submit successfully', 'Report');
                          $timeout(function () {
                            $state.go('app.home.all');
                          }, 100);
                        } else {
                          toastr.warning("Submit Errors", 'Report');
                        }
                      }, function (data) { toastr.warning(data, 'Report'); });
                    }
                  });
                }, function (data) { toastr.warning(data.message, 'Report'); });
              }
            }
            break;
        }

      }
      else if (value == 'acknowledged') {
        $scope.error = "";
        ReportApi.acknowledge($scope.reportId).then(function (data) {
          if (data.errors != null && data.errors.length > 0) {
            $.each(data.errors, function (index, erroritem) {
              $scope.error += erroritem.tab + ': ' + erroritem.error;
            });
            toastr.warning($scope.error, 'Report');
          } else {
            toastr.success('knowledge success', 'Report');
            $timeout(function () {
              $state.go('app.home.all');
            }, 100);
          }
        }, function (data) { toastr.warning(data, 'Report'); });
      }
    }

    // load tab default
    if ($scope.currentTab == '' || $scope.currentTab == undefined)
      $scope.loadTag('ProblemIntrumentation');

    if ($scope.viewMode) {
      $scope.isView = true;
      $scope.canCancel = true;
    }
  }
})();