(function () {
    'use strict';

    angular
        .module('app.createdailyreport')
        .controller('CreateDailyReportAttachmentController', CreateDailyReportAttachmentController);

    /** @ngInject */
    function CreateDailyReportAttachmentController($mdSidenav, $scope, $state, $timeout, $window, $mdDialog) {
        var vm = this;
        $scope.status = '';
        $scope.customFullscreen = false;


        $scope.pageSize = 10;
        $scope.mainGridOptions = {
            dataSource: {
                type: "odata",
                transport: {
                    read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
                }
            },
            columns: [{
                field: "FirstName",
                title: "File Name",
                width: "180px"
            }, {
                field: "LastName",
                title: "Remarks"
            }],
            scrollable: false,
            sortable: true,
            pageable: true
        };
        $scope.addAttachDialog = function (ev) {
            $mdDialog.show({
                controller: CreateDailyReportAttachmentController,
                template: $("#editorTemplate").html(),
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function (doEvent) {
                $scope.status = 'You said the information was "' + doEvent + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };
        $scope.doEvent = function (ev) {

            //Todo

            $mdDialog.hide();
        };
    }

})();