(function() {
  'use strict';

  angular
    .module('app.adminrole')
    .controller('RoleController', RoleController);

  /** @ngInject */
  function RoleController($mdSidenav,
    $scope,
    $state,
    $rootScope,
    $q,
    $timeout,
    manageRoleApi,
    activeDirectoryApi,
      appConfig,
    ReportShareService) {
    var vm = this;

    $scope.pageSize = appConfig.pageSize;
    $scope.pageSizes = appConfig.pageSizes;

    var currentTab = ReportShareService.getCurrentAdminRoleTab();
    vm.LstUserRoles = [
      {
        id: 1,
        name: "Admin"
      },
      {
        id: 2,
        name: "Engineer"
      },
      {
        id: 3,
        name: "Guest"
      },
      {
        id: 4,
        name: "Manager"
      },
      {
        id: 5,
        name: "Technician"
      }
    ];
  

    function _onOpen(e) {
      $timeout(function() {
        e.sender.list.closest('.k-animation-container').find('.k-list-container')
          .addClass('multiselect_panel no_grouping');
      });
    };

    $scope.onOpen = _onOpen;

    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function(options) {
          return manageRoleApi.getAllUserRole(options, $scope.Keyword, currentTab);
        },
        destroy: function (options) {
          var id = options.data.models[0].id;
          manageRoleApi.deleteUserRole(id).then(function (data) {
            toastr.success('Delete Success', 'Report');
            $('.report-grid').data('kendoGrid').dataSource.read();
            $('.report-grid').data('kendoGrid').refresh();
            $scope.$emit('recountTotalRole');
          });
        },
        parameterMap: function (options, operation) {
        }
      },
      batch: true,
      serverFiltering: true,
      serverSorting: true,
      serverPaging: true,
      pageSize: $scope.pageSize,
      schema: {
        data: function(e) {
          return e.data;
        },
        total: "total",
        model: {
          id: "id",
          fields: {
            order: { type: "number" },
            staffName: { type: "string" },
            userName: { type: "string" },
            userRole: { type: "object" }
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
          width: "50px",
          template: "<strong>#:data.order#</strong>"
        },
        {
          field: "staffName",
          title: "Staff Name",
          width: "300px"
        },
        {
          field: "userName",
          title: "User Name",
          width: "200px",
          template: "#:data.userName#"
        },
        {
          field: "userRole",
          title: "User Role",
          width: "200px",
          editable: false,
          template: function(dataItem) {
            var result = "";
            if (dataItem.userRole != null && dataItem.userRole.length > 0) {
              $.each(dataItem.userRole,
                function(index, value) {
                  result = result + "<span class='badge'>" + value.name + "</span>" + "<br />";
                });
            }
            return result;
          }
        },
        {
          command: ["edit", "destroy"],
          title: "&nbsp&nbsp&nbspAction",
          width: "10%"
        }
      ],
      editable: {
        mode: "popup",
        template: kendo.template($("#editorTemplate").html())
      },
      edit: function (e) {
        var multiSelect = $('#user-role').data("kendoMultiSelect");
        multiSelect.value([]);
        vm.LstSelectedUserRoles = [];
      },
      save: function(e) {
        e.preventDefault();
      
        var selectedUserRoles = vm.LstSelectedUserRoles;
        var userName = e.model.userName;
        manageRoleApi.saveUserRole(userName, selectedUserRoles).then(function (data) {
          toastr.success('Save Success', 'Report');
          $('.report-grid').data('kendoGrid').dataSource.read();
          $('.report-grid').data('kendoGrid').refresh();
          $scope.$emit('recountTotalRole');
        });
      }
    }

    $scope.$on("addNewRoleOk", function (event, data) {
      toastr.success('Save Success', 'Report');
      $('.report-grid').data('kendoGrid').dataSource.read();
      $('.report-grid').data('kendoGrid').refresh();
    });

    $scope.$on("seachExcute", function (event, data) {
      $scope.Keyword = data;
      $scope.gridDataSource.query({
        page: 1,
        pageSize: $scope.pageSize
      });
    });

    $timeout(function() {

      $('.k-grid-edit').click(function (e) {
          vm.LstSelectedUserRoles = [];
        });

      }, 1000

    );

};

})();