(function () {
  'use strict';

  angular
    .module('app.advancedSearch')
    .controller('ReportAdvancedSearchController', ReportAdvancedSearchController);

  /** @ngInject */
  function ReportAdvancedSearchController($mdSidenav, $scope, $state, $timeout, $window, homeApi,RPInsApi, accountApi, appConfig) {
    var vm = this;
    $scope.pageSize = appConfig.pageSize;
    $scope.pageSizes = appConfig.pageSizes;
    $scope.isSearch = false;

    function init() {
      homeApi.searchAdvancedDefault().then(function(data) { 
        $scope.areas = data.areas;
        $scope.groups ={ "data": data.groups, "group": "groupName" };
        $scope.units ={ "data": data.units, "group": "groupName" };
        $scope.types ={ "data": data.types, "group": "groupName" };
        $scope.workTypes = data.workTypes;
        $scope.failureTypes = data.failureTypes;
        $scope.status = data.status;
        $scope.workCompletions = data.workCompletions;
        $scope.constraints = data.constraints;
      });
    };

    init();

    vm.userInfo = accountApi.getUserInfo();
    $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician";
      }) > -1;

    $scope.canDeleteReport = _.findIndex(vm.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician" || o === "Manager";
      }) > -1;

    // $scope.areaChange = function(areaId) {
    //   homeApi.getUnitsById(areaId).then(function (data) {
    //     $scope.units = data;
    //   }, function (data) { $scope.error = data });

    //   // homeApi.getGroupsById(areaId).then(function (data) {
    //   //   $scope.groups = data;
    //   // }, function (data) { $scope.error = data });
    // };

    // $scope.groupChange = function (groupId) {
    //   homeApi.getTypesById(groupId).then(function (data) {
    //     $scope.types = data;
    //   }, function (data) { $scope.error = data });
    // };

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

    // Grid Search    

    // Data Source
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
            return homeApi.searchAdvancedReport(options,
              $scope.createBy,
              $scope.areaId,
              $scope.startDate,
              $scope.unitId,
              $scope.endDate,
              $scope.groupId,
              $scope.tagNo,
              $scope.workCompletionId,
              $scope.constraintId,
              $scope.typeId,
              $scope.statusId,
              $scope.workTypeId,
              $scope.failureTypeId);
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
            reportNumber: { type: "string" },
            area: { type: "string" },
            tagNo: { type: "string" },
            problemDescription: { type: "string" },
            workType: { type: "string" },
            status: { type: "string" },
            creationDate: { type: "string" },
            createBy: { type: "string" },
            canDelete: { type: "boolean" },
            canUpdate: { type: "boolean" }
          }
        }
      }
    });

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

    // Grid Options

    $scope.mainGridOptions = {
      pageable: {
        pageSizes: $scope.pageSizes
      },
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
      scrollable: false,
      dataSource: $scope.gridDataSource,
      columns: [
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
          width: "150px"
        },
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
          width: "100px"
        },
        {
          field: "problemDescription",
          filterable: false,
          title: "Problem Description",
          width: "220px"
        },
        {
          field: "workType",
          title: "Work Type",
          filterable: {
            ui: $scope.workTypeFilter
       },
          width: "150px"
        },
       
        {
          field: "createBy",
          title: "Create By",
          filterable: {
            ui: $scope.userFilter
       },
          width: "150px"
        },
        {
          field: "creationDate",
          title: "Creation Date",
          filterable: {
              ui: $scope.creationDateFilter
          },
          width: "100px"
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
            return "<span>{{dataItem.status}}</span><a href='#'>...</a>";
          }
        }
      ]
    };

    $timeout(function(){
      debugger;
      var filterMenu = $scope.grid.thead.find("th:not(.k-hierarchy-cell,.k-group-cell):last").data("kendoFilterMenu");
      var filterAreaMenu = $($scope.grid.thead.find("th:not(.k-hierarchy-cell,.k-group-cell)")[2]).data("kendoFilterMenu");
      filterMenu.element.find("span.k-dropdown:first").css("display", "none");
    },1000);

    $("#home-context-menu").kendoContextMenu({
      target: "#search-grid",
      showOn: "click contextmenu",
      filter: "td.divActions",
      dataSource: [{ text: "View", cssClass: "viewRow", key: "View" }, { text: "Update", cssClass: "editRow", key: "Update" }, { text: "Delete", cssClass: "removeRow", key: "Delete" }],
      close: function (e) {

        var contextMenu = $("#home-context-menu").data("kendoContextMenu");

        contextMenu.bind("open", handler);
        setTimeout(function () {
            contextMenu.unbind("open", handler);
          },
          0);
      },
      open: function (e) {
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
        var grid = $(".home-grid").data("kendoGrid");
        var item = $(e.item).find("span").text();
        var id = $(e.target).closest("tr").find('.unique-id-hidden').first().text();
        switch (item) {
        case "View":
          $state.go("app.createdailyreport", { reportId: parseInt(id), context: "View" });
          break;
        case "Update":
          $state.go("app.createdailyreport", { reportId: parseInt(id), context: "Update" });
          break;
        case "Delete":
          if (window.confirm("Would you like to delete this item?")) {
            homeApi.deleteReport(parseInt(id)).then(function (data) {
              $('#search-grid').data('kendoGrid').dataSource.read();
              $('#search-grid').data('kendoGrid').refresh();
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

    $scope.Search = function () {
      $scope.isSearch = true;
      $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    }

    // End
  }
})();