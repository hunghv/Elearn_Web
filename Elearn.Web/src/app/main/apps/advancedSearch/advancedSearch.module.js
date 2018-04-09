(function () {
  'use strict';

  angular
    .module('app.advancedSearch', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider.state('app.advancedSearch', {
      title: 'Search',
      url: '/Search',
      params: { tag: null },
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/advancedSearch/advancedSearch.html',
          controller: 'ReportAdvancedSearchController as vm'
        }
      },
      bodyClass: ''
    });   
  }

})();