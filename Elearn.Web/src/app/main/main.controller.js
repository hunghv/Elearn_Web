(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($window, $scope, $rootScope, appConfig) {
        // Data
        var vm = this;

        //////////
        $rootScope.constants = appConfig;

        if ($window.innerWidth < 960) {
            $rootScope.isMobile = true;
        }
        $(window).resize(function () {
            if ($window.innerWidth < 960) {
                $rootScope.isMobile = true;
            } else {
                $rootScope.isMobile = false;
            }
            $scope.$apply();
        });

        $rootScope.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event) {
            if (event.targetScope.$id === $scope.$id) {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });

        vm.GoToPage = function() {
            alert(1);
        }
        
    }
})();