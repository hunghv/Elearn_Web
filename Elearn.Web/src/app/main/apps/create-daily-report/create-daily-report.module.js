(function () {
    'use strict';

    angular
      .module('app.createdailyreport', [])
      .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.createdailyreport', {
            title: 'Create Daily Report',
            url: '/create-daily-report/:reportId/:context',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/create-daily-report/create-daily-report.html',
                    controller: 'CreateDailyReportController as vm'
                }
            },
            bodyClass: ''
        });

        //$stateProvider.state('app.detaildailyreport', {
        //        title: 'Detail Daily Report',
        //        url: '/detail-daily-report/:reportId/:context',
        //        views: {
        //            'content@app': {
        //                templateUrl: 'app/main/apps/create-daily-report/detail-daily-report.html',
        //                controller: 'DetailDailyReportController as vm'
        //            },
        //            'subContent@app.detaildailyreport': {
        //            },
        //        },
        //        bodyClass: ''
        //    });

    }
})();