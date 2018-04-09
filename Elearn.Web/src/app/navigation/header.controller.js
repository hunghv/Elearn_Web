(function () {
  'use strict';

  angular
      .module('app.header')
      .controller('HeaderController', HeaderController);

  /** @ngInject */
  function HeaderController($rootScope, $mdSidenav, $translate, $mdToast, $scope, $state,$stateParams, $window, accountApi) {
    var vm = this;

    // Data

    vm.logout = logout;
    $scope.defaultImage = true;
    $scope.userInfo = accountApi.getUserInfo();
    $scope.canCreateReport = _.findIndex($scope.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician";
      }) > -1;
    $scope.canCreateDetailReport = _.findIndex($scope.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Manager";
      }) > -1;
    $scope.defaultImageUrl = 'assets/images/NoAvatar.jpg';
    $scope.canAdmin = _.findIndex($scope.userInfo.roles,
      function (o) {
        return o === "Admin";
      }) > -1;

    $scope.userName = $scope.userInfo.userName;

    if ($scope.userInfo)
      $scope.defaultImage = false;

    $scope.onHomeClick = function(e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "home");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "home");
      }
      else {
        $state.go('app.home.all');
      }
    }

    $scope.onCreateDetailReport = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "detailreport");
      } 
      else {
        $state.go('app.detailreport', { 'detailreportId': 0, 'context': 'Create' });
      }
    }

    $scope.onCreateDailyReport = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "dailyreport");
      }
      else {
        $state.go('app.createdailyreport',{'reportId':0,'context':'Create'});
      }
    }

    $scope.onSearchDetailReport = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "searchdetail");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "searchdetail");
      }
      else {
        $state.go('app.searchDetailReport');
      }
    }

    $scope.onSearchDailyReport = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "searchdaily");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "searchdaily");
      }
      else {
        $state.go('app.advancedSearch');
      }
    }

    $scope.adminRoleClick = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminrole");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminrole");
      }
      else {
        $state.go('app.adminrole', { 'tab': 1 });
      }
    }

    $scope.adminTagClick = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "admintag");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "admintag");
      }
      else {
        $state.go('app.admintag');
      }
    }

    $scope.adminMasterClick = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminmaster");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminmaster");
      }
      else {
        $state.go('app.masterdata');
      }
    }

    $scope.adminIndicatorClick = function (e) {
      e.preventDefault();
      var currentState = $state.current.name;
      var param = $state.params;
      if (currentState === "app.createdailyreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminindicator");
      } else if (currentState === "app.detailreport" && param.context != undefined && param.context === "Create") {
        $scope.$emit('messageOne', "adminindicator");
      }
      else {
        $state.go('app.adminindicator');
      }
    }

    //////////

    //init();

    ///**
    // * Initialize
    // */
    //function init() {
    //  // Get the selected language directly from angular-translate module setting
    //  vm.userName = localStorage.getItem('email');
    //  vm.profilePhoto = localStorage.getItem('photo') === 'null' ? null : localStorage.getItem('photo');
    //}

    /**
     * Logout Function
     */
    function logout() {
      // Do logout here..
      //var currentToken = CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
      accountApi.api.logoutAccount
                .save({}
                , function (response) {
               
                  $window.localStorage.clear();
                  $state.go('app.pages_auth_login');
                }
              , function (response) {
                $window.localStorage.clear();
                  $state.go('app.pages_auth_login');
                   console.log(response);
              });
    }
  }

})();
