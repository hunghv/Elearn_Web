(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
      .module('fuse', [
        'ui.router',
        'ngSanitize',
        'kendo.directives',
        'ngAnimate',
        'toastr',
        'ui.bootstrap',
        'angular-loading-bar',
        'ngCountTo',

        'app.core',
        'app.pages',
        'app.header',
        'app.footer',
        'app.pages',
        'app.home',
        'app.advancedSearch',
        'app.searchDetailReport',
        "app.adminrole",
        "app.admintag",
        "app.createdailyreport",
        "app.masterdata",
        "app.detailreport",
        "app.adminindicator"
      ]);
})();
