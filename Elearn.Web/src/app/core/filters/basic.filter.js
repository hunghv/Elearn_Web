(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('toTrusted', toTrustedFilter)
        .filter('htmlToPlaintext', htmlToPlainTextFilter)
        .filter('nospace', nospaceFilter)
        .filter('humanizeDoc', humanizeDocFilter)
        .filter('shortName', shortName)
        .filter('range', range);

    /** @ngInject */
    function toTrustedFilter($sce) {
        return function (value) {
            return $sce.trustAsHtml(value);
        };
    }

    /** @ngInject */
    function htmlToPlainTextFilter() {
        return function (text) {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }

    /** @ngInject */
    function nospaceFilter() {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    }

    /** @ngInject */
    function humanizeDocFilter() {
        return function (doc) {
            if (!doc) {
                return;
            }
            if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function ($1) {
                    return '-' + $1.toLowerCase();
                });
            }
            return doc.label || doc.name;
        };
    }
    /** @ngInject */
    function shortName() {
        return shortNameFilter;

        function shortNameFilter(input, Params) {
            var out = '';
            if (input) {
                if (input !== '' && Params === 2) {
                    var arr = input.split('@')[0].split('.');
                    for (var i = 0; i < arr.length; i++) {
                        out = out + arr[i].charAt(0).toUpperCase();
                    }
                } else {
                    out = input.charAt(0).toUpperCase();
                }
            } else {
                return 'A';
            }

            return out;
        }
    }

    function range() {
        return rangeFilter;

        function rangeFilter(input, total) {
            total = parseInt(total);

            for (var i = 0; i < total; i++) {
                input.push(i);
            }

            return input;
        }
    }

})();