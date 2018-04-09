(function () {
    'use strict';

    angular
        .module('app.masterdata')
        .controller('MasterDataController', MasterDataController);

    /** @ngInject */
    function MasterDataController($mdSidenav, $scope, $state, $rootScope,$stateParams, $q, accountApi) {
        var vm = this;
        $scope.context = $stateParams.context;
        $scope.Search = function () {
            var keyWord = $scope.Keyword; 
            $rootScope.$broadcast("seachExcute", keyWord);
        };

        vm.userInfo = accountApi.getUserInfo();
        $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
            function (o) {
                return o === "Admin" || o === "Engineer" || o === "Technician";
            }) > -1;



        vm.tabChange = function ($event, tab) {
            var current = $event.currentTarget;
            $("#home").find("li").removeClass("active");
            $(current).parent().addClass("active");
            switch (tab) {
                case 'All':
                    $state.go("app.masterdata.all");
                    break;
                case 'WorkType':
                    $state.go("app.masterdata.worktype");
                    break;
                case 'Brand':
                  $state.go("app.masterdata.brand");
                  break;
                case 'FailureType':
                    $state.go("app.masterdata.failuretype");
                    break;
                case 'Constain':
                    $state.go("app.masterdata.constain");
                    break;
                case 'WorkCompletion':
                    $state.go("app.masterdata.workcompletion");
                    break;
                case 'QTY':
                    $state.go("app.masterdata.qty");
                    break;
            };

        }
    }
})();