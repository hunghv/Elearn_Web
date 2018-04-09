(function() {
  'use strict';

  angular
    .module('app.adminrole')
    .controller('ManageRoleController', ManageRoleController);

  /** @ngInject */
  function ManageRoleController($mdSidenav, $scope, $state, $rootScope, $q, $timeout, ReportShareService, manageRoleApi, homeApi, activeDirectoryApi) {
    var vm = this;
    $scope.TotalTechnician = 0;
    $scope.TotalEngineer = 0;
    $scope.TotalManager = 0;
    $scope.TotalGuest = 0;
    $scope.TotalAdmin = 0;
    $scope.total = 0;
    vm.LstSelectedUserRoles = [];
   
    function init() {
      manageRoleApi.getTotalRole().then(function (data) {
        $scope.TotalTechnician = data.totalTechnician;
        $scope.TotalEngineer = data.totalEngineer;
        $scope.TotalManager = data.totalManager;
        $scope.TotalGuest = data.totalGuest;
        $scope.TotalAdmin = data.totalAdmin;
        $scope.total = data.total;
      });
    };

    init();

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

    $scope.$on('recountTotalRole', function (event, data) {
      init();
    });

    function _showDialog() {
      vm.LstSelectedUserRoles = [];
      $scope.userAccount = "";
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

    $scope.searhAutoCompUser = {
      dataTextField: "displayName",
      dataValueField: "name",
      filter: "contains",
      placeholder: "Select user...",
      delay: 500,
      dataSource: new kendo.data.DataSource({
        serverFiltering: true,
        transport: {
          read: function (options) {
            return activeDirectoryApi.searchAdUserRole(options).then(function (data) {
              options.success(data);
            }, function (data) { $scope.error = data });
          }
        }
      }),
      change: function (e) {
        debugger;
        var a = this.dataItem();
        console.log(a);
        $scope.displayName = "";
        $scope.department = "";
        $scope.name = $scope.userAccount;
        if (a != undefined) {
          $scope.displayName = a.displayName;
          $scope.department = a.department;
          $scope.name = a.name;
        }
      }
    };

    $scope.submit = function () {
      var validator = $("#create-update-form").kendoValidator({
        rules: {
          username: function (input) {
            debugger;
            if (input.is("[data-username-msg]")) {
              return !_.isEmpty($scope.userAccount) && _.trim(input.val()).length !== 0;
            }
            return true;
          },
          userrole: function (input) {
            if (input.is("[data-userrole-msg]")) {
              return !_.isEmpty(vm.LstSelectedUserRoles);
            }
            return true;
          }
        },
        messages: {
          username: 'Mandatory field.',
          userrole: 'Mandatory field.'
        }
      }).data("kendoValidator");

      if (validator.validate()) {
        var userName = $scope.userAccount;
        var roles = vm.LstSelectedUserRoles;
        manageRoleApi.saveUserRoleByDisplay($scope.name, $scope.displayName, $scope.department, roles).then(function (data) {
          _hideDialog();
          init();
          $rootScope.$broadcast("addNewRoleOk");
        }, function (error) {
          _hideDialog();
          toastr.warning('User did not exist', 'Report');
        });
      };
    };

    $scope.Search = function () {
      var keyWord = $scope.Keyword;
      $rootScope.$broadcast("seachExcute", keyWord);
    };    

    vm.createNewReport = function createNewReport() {
      $state.go("app.createdailyreport", { reportId: 0, context: "Create" });
    }

    $scope.$on('recountTotal', function (event, data) {
      init();
    });

    vm.gotoAllTab = function($event) {
      $("#home").find("li").removeClass("active");
      $("#home").find("li").eq(0).addClass("active");
      ReportShareService.setCurrentAdminRoleTab("All");
      $state.go("app.adminrole.all");
    }

    vm.tabChange = function ($event, tab) {
      var current = $event.currentTarget;
      $("#home").find("li").removeClass("active");
      $(current).parent().addClass("active");
      switch (tab) {
      case 'All':
        ReportShareService.setCurrentAdminRoleTab("All");
        $state.go("app.adminrole.all");
        break;
        case 'Technician':
          ReportShareService.setCurrentAdminRoleTab("Technician");
          $state.go("app.adminrole.technician");
        break;
        case 'Engineer':
          ReportShareService.setCurrentAdminRoleTab("Engineer");
          $state.go("app.adminrole.engineer");
        break;
        case 'Manager':
          ReportShareService.setCurrentAdminRoleTab("Manager");
          $state.go("app.adminrole.manager");
        break;
        case 'Guest':
          ReportShareService.setCurrentAdminRoleTab("Guest");
          $state.go("app.adminrole.guest");
        break;
        case 'Admin':
          ReportShareService.setCurrentAdminRoleTab("Admin");
          $state.go("app.adminrole.admin");
        break;
      };
    }
   
   
  }
})();