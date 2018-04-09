(function () {
    'use strict';

    angular
      .module('app.detailreport', [])
      .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.detailreport', {
            title: 'New Detail Report',
            url: '/detail-report/:detailreportId/:context',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/detail-report/detail-report.html',
                    controller: 'DetailReportController as vm'
                },
                'subContent@app.detailreport': {
                },
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