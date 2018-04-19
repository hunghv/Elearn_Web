(function ()
{
    'use strict';
  angular.module("app.categories", [])
  .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider,  msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.categories', {
                url    : '/categories',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/Categories/categories.html',
                        controller : 'CategoriesController as vm'
                    }
                },
        
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/Categories');

        // Api
    //    msApiProvider.register('categories', ['app/data/categories/categories.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'categories',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.categories', {
            title    : 'categories',
            icon     : 'icon-tile-four',
            state    : 'app.categories',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'CATEGORIES.CATEGORIES_NAV',
            weight   : 1
        });
    }
})();