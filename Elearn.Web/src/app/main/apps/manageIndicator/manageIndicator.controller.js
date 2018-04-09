(function() {
  'use strict';

  angular
    .module('app.adminindicator')
    .controller('ManageIndicatorController', ManageIndicatorController);

  function ManageIndicatorController($mdSidenav, $scope, $state, $timeout, $window, manageIndicatorApi, ReportShareService) {

    var vm = this;

    var init = function() {
      manageIndicatorApi.getIndicatorTypes().then(function(data) {
        $scope.lstTabs = data;
      });
    }

    init();

    vm.tabChange = function($event, tabName) {
      var current = $event.currentTarget;
      $("#home").find("li").removeClass("active");
      $(current).parent().addClass("active");

      switch (tabName) {
      case 'FIELD':
        ReportShareService.setCurrentIndicatorTab(1);
        $state.go("app.adminindicator.field");
        break;
      case 'QMI':
        ReportShareService.setCurrentIndicatorTab(5);
        $state.go("app.adminindicator.qmi");
        break;
      case 'SYSTEM':
        ReportShareService.setCurrentIndicatorTab(4);
        $state.go("app.adminindicator.system");
        break;
      case 'OTHER':
        ReportShareService.setCurrentIndicatorTab(6);
        $state.go("app.adminindicator.other");
        break;
      };
    }

    // End
  } 
})();