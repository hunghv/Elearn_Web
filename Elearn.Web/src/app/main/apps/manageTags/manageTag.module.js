(function () {
  'use strict';

  angular.module("app.admintag", [])
    .config(config);

  function config($stateProvider) {
    $stateProvider.state('app.admintag',
      {
        title: 'Manage Tag',
        url: '/admin-tag',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/manageTags/manageTag.html',
            controller: 'ManageTagController as vm'
          }
      }
      });
  }

})();