(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', mainController);

    /** @ngInject */
    function mainController($scope, $rootScope)
    {
        // Data

        //////////

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if ( event.targetScope.$id === $scope.$id )
            {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
})();