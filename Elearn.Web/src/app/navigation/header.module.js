(function ()
{
    'use strict';

    angular
        .module('app.header', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        // $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();
