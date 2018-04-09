/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .filter('random', random);

    /** @ngInject */
    function random() {
        return function (value) {
            return value + '?rd=' + Math.random();
        }
    }
})();