(function () {
    'use strict';

    angular
        .module('app.masterdata', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.masterdata', {
            title: 'Master data',
            url: '/master-data',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/master-data/masterdata.html',
                    controller: 'MasterDataController as vm'
                },
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/all/template.html',
                    controller: 'MasterDataAreaController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.all', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/all/template.html',
                    controller: 'MasterDataAreaController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.worktype', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/work-type/workType.html',
                    controller: 'WorkTypeController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.failuretype', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/failure-type/template.html',
                    controller: 'FailureTypeController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.constain', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/constain/template.html',
                    controller: 'ConstainDataController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.workcompletion', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/work-completion/template.html',
                    controller: 'WorkCompletionController as vm'
                }
            },
            bodyClass: ''
        });

        $stateProvider.state('app.masterdata.qty', {
            title: 'Master data',
            url: '',
            params: { tag: null },
            views: {
                'subContent@app.masterdata': {
                    templateUrl: 'app/main/apps/master-data/qty/template.html',
                    controller: 'QTYDataController as vm'
                }
            },
            bodyClass: ''
        });

      $stateProvider.state('app.masterdata.brand', {
        title: 'Master data',
        url: '',
        params: { tag: null },
        views: {
          'subContent@app.masterdata': {
            templateUrl: 'app/main/apps/master-data/brand/brand.html',
            controller: 'BrandController as vm'
          }
        },
        bodyClass: ''
      });
    }

})();