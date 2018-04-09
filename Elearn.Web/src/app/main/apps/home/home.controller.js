(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($mdSidenav, $scope, $state, $rootScope, $q, ReportShareService, homeApi, accountApi) {
      var vm = this;
      $scope.TotalDraft = 0;
      $scope.TotalSubmitted = 0;
      $scope.TotalAcknowledged = 0;
      $scope.Total = 0;
      $scope.Search = function () {
        var keyWord = $scope.Keyword;
        $rootScope.$broadcast("seachExcute", keyWord); 
      };

      vm.userInfo = accountApi.getUserInfo();
      $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
          function (o) {
            return o === "Admin" || o === "Engineer" || o === "Technician";
          }) > -1;
     
      function init() {
        homeApi.getTotalReport().then(function (data) {
          $scope.TotalDraft = data.totalDraft;
          $scope.TotalSubmitted = data.totalSubmitted;
          $scope.TotalAcknowledged = data.totalAcknowledged;
          $scope.Total = data.total;
        });
      };

      init();

      vm.createNewReport = function createNewReport() {
        $state.go("app.createdailyreport", { reportId: 0, context: "Create" });
      }

      $scope.$on('recountTotal', function (event, data) {
         init();
      });

      vm.tabChange = function ($event, tab) {
        var current = $event.currentTarget;
        $("#home").find("li").removeClass("active");
        $(current).parent().addClass("active");
        switch (tab) {
          case 'All':
            ReportShareService.setCurrentHomeTab("All");
            $state.go("app.home.all");
          break;
          case 'Draft':
            ReportShareService.setCurrentHomeTab("Draft");
            $state.go("app.home.draft");
          break;
          case 'Submitted':
            ReportShareService.setCurrentHomeTab("Submitted");
            $state.go("app.home.submitted");
          break;
          case 'Acknowledged':
            ReportShareService.setCurrentHomeTab("Acknowledged");
            $state.go("app.home.acknowledged");
          break;
        };
      }
    }
})();