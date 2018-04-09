(function () {
  'use strict';

  angular
    .module('app.searchDetailReport', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider.state('app.searchDetailReport', {
      title: 'Search Detail',
      url: '/Search-Detail',
      params: { tag: null },
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/search-detail-report/searchDetailReport.html',
          controller: 'SearchDetailReportController as vm'
        }
      },
      bodyClass: ''
    });   
  }

})();