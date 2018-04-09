(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('errorMessage', errorMessage)
        .directive('validateGreaterDate', validateGreaterDate)
        .directive('requiredChip', requiredChip);

    /** @ngInject */    
    function errorMessage(appConfig) {

        return {
            scope: {
                type: '@'
            },
            link: link
        }

        function link(scope, element, attrs) {
            return element.text(appConfig.errors[scope.type]);
        }
    };

    /** @ngInject */  
    function validateGreaterDate() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {

                scope.$watchGroup(['vm.minutes.endDateObject', 'vm.minutes.startDateObject'], function (data) {
                    if (data && scope.vm.minutes.startDateObject && scope.vm.minutes.endDateObject) {
                        checkValidity();
                    }
                }, true);


                function checkValidity(modelValue) {
                    var momentEndDate= moment(scope.vm.minutes.endDateObject);
                    var momentStartDate = moment(scope.vm.minutes.startDateObject);
                    var duration = moment.duration(momentStartDate.diff(momentEndDate));
                    var minutes = duration.asMinutes();

            
                    if (minutes > 0 && attrs.name === 'timeTo') {
                        // attrs.$$element[0].children[0].children[1].classList.add('md-input-invalid');
                        // attrs.$$element[0].children[0].children[1].children[3].children[0].style.opacity = 1;
                        return ngModel.$setValidity('dateValidationError', false);
                    } else {
                        return ngModel.$setValidity('dateValidationError', true);
                    }
                }
            }
        }
    }

    /** @ngInject */
    function requiredChip() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                // console.log('hi');
            }
        }
    }

})();