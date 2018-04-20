(function ()
{
    'use strict';
  angular.module("app.country", [])
  .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider,  msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.country', {
                url    : '/country',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/country/country.html',
                        controller : 'countryController as vm'
                    }
                },
        
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/country');

        // Api
    //    msApiProvider.register('categories', ['app/data/categories/categories.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'country',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.country', {
            title    : 'country',
            icon     : 'icon-tile-four',
            state    : 'app.country',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'COUNTRY.COUNTRY_NAV',
            weight   : 1
        });
    }
})();