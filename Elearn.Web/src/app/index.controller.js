(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $scope, $http,$state, appConfig) {
        var vm = this;

      // Data
        vm.themes = fuseTheming.themes;
        $scope.dialog = false;
        (function activate() {
            if (localStorage.getItem('access-token')) {
              $http.defaults.headers.common['AccessToken'] = CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
              $http.defaults.headers.common['UserProfile'] = localStorage.getItem('userId');
            }
        })();
        $scope.$on('Dialog', function (event, data) {
            $scope.dialog = data.show;
        });
      $scope.$on('messageOne', function (event, data) {
        $scope.context = data;
        $('#messageOne').modal('show');
      });

      $scope.onConfirmMessageOne = function (e) {
        e.preventDefault();
        switch($scope.context) {
          case 'home':
            $state.go('app.home.all');
            break;
          case 'dailyreport':
            $state.go('app.createdailyreport', { 'reportId': 0, 'context': 'Create' });
            break;
          case 'detailreport':
            $state.go('app.detailreport', { 'reportId': 0, 'context': 'Create' });
            break;
          case 'searchdaily':
            $state.go('app.advancedSearch');
            break;
          case 'searchdetail':
            $state.go('app.searchDetailReport');
            break;
          case 'adminrole':
            $state.go('app.adminrole',{'tab':1});
            break;
          case 'admintag':
            $state.go('app.admintag');
            break;
          case 'adminmaster':
            $state.go('app.masterdata');
            break;
          case 'adminindicator':
            $state.go('app.adminindicator');
            break;
        }
      }
    }
})();