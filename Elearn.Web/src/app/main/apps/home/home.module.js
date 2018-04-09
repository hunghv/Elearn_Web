(function () {
    'use strict';

    angular
        .module('app.home', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.home', {
            title: 'Home',
            url: '/',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/home/home.html',
                    controller: 'HomeController as vm'
                },
                'subContent@app.home': {
                  templateUrl: 'app/main/apps/home/search/reportsearch.html',
                  controller: 'ReportSearchController as vm'
                }
            },
            bodyClass: ''
        });

      $stateProvider.state('app.home.all', {
        title: 'Home',
        url: '',
        params: { tag: null },
        views: {
          'subContent@app.home': {
            templateUrl: 'app/main/apps/home/search/reportsearch.html',
            controller: 'ReportSearchController as vm'
          }
        },
        bodyClass: ''
      });

      $stateProvider.state('app.home.draft', {
        title: 'Home',
        url: '',
        params: { tag: null },
        views: {
          'subContent@app.home': {
            templateUrl: 'app/main/apps/home/search/reportsearch.html',
            controller: 'ReportSearchController as vm'
          }
        },
        bodyClass: ''
      });

      $stateProvider.state('app.home.submitted', {
        title: 'Home',
        url: '',
        params: { tag: null },
        views: {
          'subContent@app.home': {
            templateUrl: 'app/main/apps/home/search/reportsearch.html',
            controller: 'ReportSearchController as vm'
          }
        },
        bodyClass: ''
      });

      $stateProvider.state('app.home.acknowledged', {
        title: 'Home',
        url: '',
        params: { tag: null },
        views: {
          'subContent@app.home': {
            templateUrl: 'app/main/apps/home/search/reportsearch.html',
            controller: 'ReportSearchController as vm'
          }
        },
        bodyClass: ''
      });
    }

})();