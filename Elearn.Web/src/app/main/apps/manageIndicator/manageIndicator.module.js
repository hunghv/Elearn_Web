(function () {
  'use strict';

  angular.module("app.adminindicator", [])
    .config(config);

  function config($stateProvider) {
    $stateProvider.state('app.adminindicator',
      {
        title: 'Manage Indicator',
        url: '/admin-indicator',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/manageIndicator/manageIndicator.html',
            controller: 'ManageIndicatorController as vm'
          },
          'subContent@app.adminindicator': {
            templateUrl: 'app/main/apps/manageIndicator/indicator/indicator.html',
            controller: 'IndicatorController as vm'
          }
      }
      });

    $stateProvider.state('app.adminindicator.field', {
      title: 'Manage Indicator',
      url: '',
      views: {
        'subContent@app.adminindicator': {
          templateUrl: 'app/main/apps/manageIndicator/indicator/indicator.html',
          controller: 'IndicatorController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminindicator.qmi', {
      title: 'Manage Indicator',
      url: '',
      views: {
        'subContent@app.adminindicator': {
          templateUrl: 'app/main/apps/manageIndicator/indicator/indicator.html',
          controller: 'IndicatorController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminindicator.system', {
      title: 'Manage Indicator',
      url: '',
      views: {
        'subContent@app.adminindicator': {
          templateUrl: 'app/main/apps/manageIndicator/indicator/indicator.html',
          controller: 'IndicatorController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminindicator.other', {
      title: 'Manage Indicator',
      url: '',
      views: {
        'subContent@app.adminindicator': {
          templateUrl: 'app/main/apps/manageIndicator/indicator/indicator.html',
          controller: 'IndicatorController as vm'
        }
      },
      bodyClass: ''
    });
  }

})();