(function () {
  'use strict';

  angular
    .module('app.searchDetailReport')
    .controller('SearchDetailReportController', SearchDetailReportController);

  /** @ngInject */
  function SearchDetailReportController($mdSidenav, $scope, $state, $timeout, $window, homeApi, accountApi, appConfig) {
    var vm = this;
    $scope.pageSize = appConfig.pageSize;
    $scope.pageSizes = appConfig.pageSizes;
    $scope.isSearch = false;

    function init() {
      homeApi.searchDetailDefault().then(function (data) {
        $scope.status = data.status;
        $scope.areas = data.areas;
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

    $scope.searhAutoCompUser = {
      dataTextField: "displayName",
      dataValueField: "userName",
      filter: "contains",
      placeholder: "Select user...",
      minLength: 1,
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

    $scope.creationDateFilter = function(element) {
      element.kendoDatePicker({
        format: "MM/dd/yyyy",
        parseFormats: "{0:MM/dd/yyyy}",
      });
    }

    $scope.areaFilter = function(element) {
      element.kendoDropDownList({
          dataSource:  $scope.areas,
          dataTextField: "name",
          dataValueField: "name",
          optionLabel: "--Select Value--"
      });
  }

    // Grid Search    

    // Data Source
    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          return homeApi.searchDetailReport(options,
              $scope.createBy,
              $scope.areaId,
            $scope.statusId,
              $scope.startDate,
              $scope.endDate);
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
            startDate: { type: "string" },
            endDate: { type: "string" },
            createBy: { type: "string" },
            createOn: { type: "string" },
            canDelete: { type: "boolean" },
            canUpdate: { type: "boolean" }
          }
        }
      }
    });

    // Grid Options

    $scope.mainGridOptions = {
      pageable: {
        pageSizes: $scope.pageSizes
      },
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
          width: "160px"
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
          width: "70px"
        },
        {
          field: "startDate",
          title: "Start Date",
          filterable: {
            ui: $scope.creationDateFilter
        },
          width: "90px"
        },
        {
          field: "endDate",
          title: "End Date",
          filterable: {
            ui: $scope.creationDateFilter
        },
          width: "90px"
        },
       
        {
          field: "createOn",
          title: "Create On",
          filterable: {
            ui: $scope.creationDateFilter
        },
          width: "100px"
        },
        {
          field: "createBy",
          title: "Create By",
          filterable: {
            ui: $scope.userFilter
       },
          width: "200px",
          attributes: {
            "class": "divActions"
          },
          template: function (dataItem) {
            return "<span>{{dataItem.createBy}}</span><a href='#'>...</a>";
          }
        }
      ]
    };

    $("#home-context-menu").kendoContextMenu({
      target: "#search-grid",
      showOn: "click contextmenu",
      dataSource: [{ text: "View", cssClass: "viewRow", key: "View" }, { text: "Update", cssClass: "editRow", key: "Update" }, { text: "Delete", cssClass: "removeRow", key: "Delete" }],
      filter: "td.divActions",
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
          $state.go("app.detailreport", { detailreportId: parseInt(id), context: "View" });
          break;
        case "Update":
          $state.go("app.detailreport", { detailreportId: parseInt(id), context: "Update" });
          break;
        case "Delete":
          if (window.confirm("Would you like to delete this item?")) {
            homeApi.deleteDetailReport(parseInt(id)).then(function (data) {
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