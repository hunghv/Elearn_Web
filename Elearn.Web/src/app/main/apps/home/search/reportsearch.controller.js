(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('ReportSearchController', ReportSearchController);

  /** @ngInject */
  function ReportSearchController($mdSidenav, $scope, $state, homeApi, $timeout, ReportShareService, accountApi,RPInsApi, appConfig) {
    var vm = this;
    var currentTab = ReportShareService.getCurrentHomeTab();
    $scope.pageSize = appConfig.pageSize;
    $scope.pageSizes = appConfig.pageSizes;
    $scope.sortField = [];
    vm.userInfo = accountApi.getUserInfo();
    $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician";
      }) > -1;

    $scope.canDeleteReport = _.findIndex(vm.userInfo.roles,
      function(o) {
        return o === "Admin" || o === "Engineer" || o === "Technician" || o === "Manager";
      }) > -1;

      function init() {
        homeApi.searchHomeDefault().then(function(data) { 
          $scope.areas = data.areas;
          $scope.status = data.status;
          $scope.workCompletions = data.workCompletions;
          $scope.workTypes = data.workTypes;
        });
      };
  
      init();

      $scope.searhAutoCompTagNo = {
        dataTextField: 'tagNo',
        filter: "contains",
        delay: 500,
        placeholder: "Select tag...",
        dataSource: new kendo.data.DataSource({
          serverFiltering: true,
          transport: {
            read: function (options) {
              return homeApi.getTags($scope.tagNo).then(function (data) {
                options.success(data);
              }, function (data) { $scope.error = data });
            }
          }
        })
      };
  
      $scope.searhAutoCompUser = {
        dataTextField: "displayName",
        dataValueField: "userName",
        filter: "contains",
        placeholder: "Select user...",
        delay: 500,
        dataSource: new kendo.data.DataSource({
          serverFiltering: true,
          transport: {
            read: function (options) {
              return homeApi.getUsers($scope.createBy).then(function (data) {
                options.success(data);
              }, function (data) { $scope.error = data });
            }
          }
        })
      };

      $scope.areaFilter = function(element) {
        element.kendoDropDownList({
            dataSource:  $scope.areas,
            dataTextField: "name",
            dataValueField: "id",
            optionLabel: "--Select Value--"
        });
    }
  
    $scope.workTypeFilter = function(element) {
      element.kendoDropDownList({
          dataSource:  $scope.workTypes,
          dataTextField: "name",
          dataValueField: "id",
          optionLabel: "--Select Value--"
      });
  }
  
  $scope.creationDateFilter = function(element) {
    element.kendoDatePicker({
      format: "MM/dd/yyyy",
      parseFormats: "{0:MM/dd/yyyy}",
    });
  }
  
  $scope.statusFilter = function(element) {
    element.kendoDropDownList({
        dataSource:  $scope.status,
        dataTextField: "name",
        dataValueField: "id",
        optionLabel: "--Select Value--"
    });
  }
  
  $scope.workCompletionFilter = function(element) {
    element.kendoDropDownList({
        dataSource:  $scope.workCompletions,
        dataTextField: "name",
        dataValueField: "id",
        optionLabel: "--Select Value--"
    });
  }

  $scope.userFilter = function(element) {
    element.kendoAutoComplete({
      dataTextField: "name",
      dataValueField: "id",
      filter: "contains",
      placeholder: "Select user...",
      delay: 500,
      dataSource: new kendo.data.DataSource({
        serverFiltering: true,
        transport: {
          read: function (options) {
            debugger;
            var keyWord = options.data.filter.filters[0].value;
            return homeApi.getAllUsers(keyWord).then(function (data) {
              options.success(data);
            }, function (data) { $scope.error = data });
          }
        }
      })
    });
  }

  $scope.tagFilter = function(element) {
    element.kendoAutoComplete({
    dataTextField: 'tagNo',
    filter: "contains",
    delay: 500,
    dataSource: new kendo.data.DataSource({
      serverFiltering: true,
      transport: {
        read: function (options) {
          var keyWord = options.data.filter.filters[0].value;
          return RPInsApi.getTags(keyWord).then(function (data) {
            options.success(data);
          }, function (data) { toastr.warning(data, 'Report'); });
        }
      }
    })
  });}

    // Data Source
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          switch (currentTab) {
            case 'All':
              return homeApi.searchReport(options, $scope.Keyword, currentTab);
            case 'Draft':
              return homeApi.searchReport(options, $scope.Keyword, currentTab);
            case 'Submitted':
              return homeApi.searchReport(options, $scope.Keyword, currentTab);
            case 'Acknowledged':
              return homeApi.searchReport(options, $scope.Keyword, currentTab);
          }
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
            order: { type: "number" },
            area: { type: "string" },
            tagNo: { type: "string" },
            problemDescription: { type: "string" },
            workType: { type: "string" },
            workCompletion: { type: "string" },
            createBy: { type: "string" },
            creationDate: { type: "string" },
            status: { type: "string" },
            canDelete: { type: "boolean" },
            canUpdate: { type: "boolean" }
          }
        }
      }
    });

    // Grid Options

    $scope.mainGridOptions = {    
      scrollable: false,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
      filterable: {
        extra: false,
        operators: {
            string: {
                containts: "Containts"
            }
        }
    },
      selectable: "row",
      dataSource: $scope.gridDataSource,
      dataBound: function(e) {
        if($scope.gridDataSource._sort){
          $scope.sortField= _.map($scope.gridDataSource._sort[0],function(item){
        return item;
      })}
      },
      columns: [
        {
          field: "id",
          hidden: true,
          attributes: {
            "class": "unique-id-hidden"
          }
        },
        {
          field: "canUpdate",
          hidden: true,
          attributes: {
            "class": "unique-update-hidden"
          }
        },
        {
          field: "canDelete",
          hidden: true,
          attributes: {
            "class": "unique-delete-hidden"
          }
        },
        {
          field: "order",
          title: "Order",
          filterable: false,
          width: "70px"
        },
        {
          field: "reportNumber",
          title: "Report Number",
          filterable: false,
          width: "140px"
        },
        {
          field: "area",
          title: "Area",
          filterable: {
            ui: $scope.areaFilter
       },
          width: "80px"
        },
        {
          field: "tagNo",
          title: "Tag No",
          filterable: {
            ui: $scope.tagFilter
       },
          width: "120px"
        },
        {
          field: "problemDescription",
          title: "Problem Description",
          filterable: false,
          width: "170px"
        },
        {
          field: "workType",
          title: "Work Type",
          filterable: {
            ui: $scope.workTypeFilter
       },
          width: "130px"
        },
        {
          field: "workCompletion",
          title: "Work Completion",
          filterable: {
            ui: $scope.workCompletionFilter
       },
          width: "150px"
        },
        {
          field: "createBy",
          title: "Create By",
          filterable: {
            ui: $scope.userFilter
       },
          width: "160px"
        },
        {
          field: "creationDate",
          title: "Creation Date",
          filterable: {
            ui: $scope.creationDateFilter
        },
          width: "130px"
        },
        {
          field: "status",
          title: "Status",
          filterable: {
            ui: $scope.statusFilter
       },
          width: "150px",
          attributes: {
            "class": "divActions"
          },
          template: function (dataItem) {
            var action = dataItem.canDelete ? dataItem.canUpdate ? "canAll" : "canDelete" : "canUpdate";
            return "<span class='" + action +"'>" + dataItem.status + "</span><a href='#'>...</a>";
          }
        }
      ]
    };

    $timeout(function () {
        $("#pager").kendoPager({
          dataSource: $scope.gridDataSource,
          pageSizes: $scope.pageSizes
        });
      },
      0);

    // Search L

    $scope.Search = function () {
      $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    }

    // Search Listening

    $scope.$on("seachExcute", function (event, data) {
      $scope.Keyword = data;
      if($scope.sortField.length > 0){
        $scope.gridDataSource.query({
          sort: { field: $scope.sortField[0], dir: $scope.sortField[1] },
          page: 1,
          pageSize: $scope.pageSize
        });
      }else{
        $scope.gridDataSource.query({
          page: 1,
          pageSize: $scope.pageSize
        });
      }
    
    });

    // Add Css
    $timeout(function() {
      $("#home-context-menu").kendoContextMenu({
        target: ".report-grid",
        showOn: "click contextmenu",
        filter: "td.divActions",
        dataSource: [{ text: "View", cssClass: "viewRow", key: "View" }, { text: "Update", cssClass: "editRow", key: "Update" }, { text: "Delete", cssClass: "removeRow", key: "Delete" }],
        close: function (e) {

          var contextMenu = $("#home-context-menu").data("kendoContextMenu");

          contextMenu.bind("open", handler);
          setTimeout(function() {
              contextMenu.unbind("open", handler);
            },
            0);
        },
        open: function(e) {
          var contextMenu = $("#home-context-menu").data("kendoContextMenu");
          var canUpdate = $(e.target).closest("tr").find('.unique-update-hidden').first().text();
          var canDelete = $(e.target).closest("tr").find('.unique-delete-hidden').first().text();
          $(".editRow").show();
          $(".removeRow").show();
          contextMenu.enable("li:eq(1)", true);
          contextMenu.enable("li:eq(2)", true);
          if (canUpdate === "false")
            $(".editRow").hide();
          if (canDelete === "false")
            $(".removeRow").hide();
        },
        select: function (e) {
          var row = $(e.target).parent()[0];
          var grid = $(".report-grid").data("kendoGrid");
          var item = $(e.item).find("span").text();
          var id = $(e.target).closest("tr").find('.unique-id-hidden').first().text();
          switch (item) {
            case "View":
              console.log(id);
              $state.go("app.createdailyreport", { reportId: parseInt(id), context: "View" });
              break;
            case "Update":
              console.log(id);
            $state.go("app.createdailyreport", { reportId: parseInt(id), context: "Update" });
            break;
            case "Delete":
              if (window.confirm("Would you like to delete this item?")) {
                homeApi.deleteReport(parseInt(id)).then(function (data) {
                  $('.report-grid').data('kendoGrid').dataSource.read();
                  $('.report-grid').data('kendoGrid').refresh();
                  $scope.$emit('recountTotal');
                });
              }
            break;
          default:
            break;
          };
        }
      });

      var handler = function (e) {
        e.preventDefault();
      };

    }, 0);

    $scope.deleteReport = function(id) {
    };

    // End
  }
})();