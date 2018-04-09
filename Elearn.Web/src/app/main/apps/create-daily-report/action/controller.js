(function () {
    'use strict';

    angular
        .module('app.createdailyreport')
        .controller('CreateDailyReportActionController', CreateDailyReportActionController);

    /** @ngInject */
    function CreateDailyReportActionController($mdSidenav, $scope, $state, $timeout, $window, ActionApi) {
        var vm = this;
        vm.action = {}

        //=================================================================
        vm.getItemById = function () {
            ActionApi.getItemById().then(function (data) {
                vm.action = data;
                $state.reportId = data.reportId;
            });
        }

        //=================================================================
        vm.getItemById();
    }

})();