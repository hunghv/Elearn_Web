(function () {
    'use strict';

    angular
        .module('app.createdailyreport')
        .controller('CreateDailyReportProblemController', CreateDailyReportProblemController);

    /** @ngInject */
    function CreateDailyReportProblemController($mdSidenav, $scope, $state, $timeout, $window, ProblemApi) {
        var vm = this;
        vm.problem = {}
      debugger;
        //=================================================================
        vm.getItemById = function () {
            ProblemApi.getItemById().then(function (data) {
                vm.problem = data;
                $state.reportId = data.reportId;
            });
        }
        //-----------------------------------------------------------------
        vm.getUnit = function (area) {
            ProblemApi.getUnits(area.id).then(function (data) {
                vm.problem.units = data;
                $state.reportId = vm.problem.reportId;
            });
        };


        vm.autoCompleteTagNo = {
            dataTextField: 'tagNo',
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options, a, b, c) {
                        var _tagNo = vm.problem.tagNo;
                        return ProblemApi.getTag(_tagNo).then(function (data) {
                            options.success(data);
                        });
                    }
                }
            })
        };
        vm.onselect = function (selected) {
            if (selected != undefined) {
                vm.problem.ecaRating = selected.dataItem.ecaRating;
                vm.problem.pid = selected.dataItem.pid;
                vm.problem.mplan = selected.dataItem.mPlan;
            }
        }

        //=================================================================
        vm.getItemById();
    }

})();