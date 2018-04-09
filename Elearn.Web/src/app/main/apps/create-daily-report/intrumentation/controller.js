(function () {
    'use strict';

    angular
        .module('app.createdailyreport')
        .controller('CreateDailyReportIntrumentationController', CreateDailyReportIntrumentationController);

    /** @ngInject */
    function CreateDailyReportIntrumentationController($mdSidenav, $scope, $state, $timeout, $window, IntrumentationApi) {
        var vm = this;  
        vm.intrumentation = {}

        //=================================================================
        vm.getItemById = function () {
            IntrumentationApi.getItemById().then(function (data) {
                vm.intrumentation = data;
                $state.reportId = data.reportId;
            });
        }

        //=================================================================
        vm.getItemById();
    }

})();