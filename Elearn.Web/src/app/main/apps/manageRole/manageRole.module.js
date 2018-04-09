(function () {
  'use strict';

  angular
    .module('app.adminrole', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider.state('app.adminrole',
      {
        title: 'Manage Role',
        url: '/admin-role',
        params: {
          tag: null
        },
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/manageRole/manageRole.html',
            controller: 'ManageRoleController as vm'
          },
          'subContent@app.adminrole': {
            templateUrl: 'app/main/apps/manageRole/role/role.html',
            controller: 'RoleController as vm'
          }
        },
        bodyClass: ''
      });

    $stateProvider.state('app.adminrole.all', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminrole.technician', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminrole.engineer', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminrole.manager', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminrole.guest', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
    $stateProvider.state('app.adminrole.admin', {
      title: 'Manage Role',
      url: '',
      views: {
        'subContent@app.adminrole': {
          templateUrl: 'app/main/apps/manageRole/role/role.html',
          controller: 'RoleController as vm'
        }
      },
      bodyClass: ''
    });
  }
})();