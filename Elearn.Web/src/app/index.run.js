(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $templateCache, accountApi) {
        // Activate loading indicator
        $templateCache.put("/app/core/template/skill-pagination.html", '<li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle>{{::getText(\'first\')}}</a></li> <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle><i class="icon-left-open"></i> {{::getText(\'previous\')}}</a></li> <li role="menuitem" ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)" ng-disabled="ngDisabled&&!page.active" uib-tabindex-toggle>{{page.text}}</a></li> <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href ng-click="selectPage(page + 1, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'next\')}} <i class="icon-right-open"></i></a></li> <li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle>{{::getText(\'last\')}}/a></li>');
        //$rootScope.activeTopMenu = function () {
        //    if ($rootScope.TopNavItems == null) return;
        //    for (var i = 0; i < $rootScope.TopNavItems.length; i++) {
        //        if ($rootScope.TopNavItems[i].url != null) {

        //            if ($rootScope.TopNavItems[i].url.indexOf('/knowledge-discovery') != -1 && $state.current.name.indexOf('knowledgeDiscovery') != -1) {
        //                $rootScope.TopNavItems[i].isActive = true;
        //            }
        //            else if ($rootScope.TopNavItems[i].url.indexOf('/insights') != -1 && $state.current.name.indexOf('insights') != -1) {
        //                $rootScope.TopNavItems[i].isActive = true;
        //            }
        //            else if ($rootScope.TopNavItems[i].url.indexOf('/expert-directory') != -1 && $state.current.name.indexOf('expertDirectory') != -1) {
        //                $rootScope.TopNavItems[i].isActive = true;
        //            }
        //            else {
        //                $rootScope.TopNavItems[i].isActive = false;
        //            }
        //        }
        //    }
        //}

        //$rootScope.activeLeftMenu = function () {
        //    try {
        //        $rootScope.isCurrentMasterData = $state.current.name.indexOf('appAdmin.masterDataAdmin') != -1;;
        //    } catch (error) {

        //    }
        //}

        //var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (e, curState) {

        //    try {
        //        if (curState.views != null && e.targetScope.state.current.views != null &&
        //            curState.views.hasOwnProperty('subContent@app.myAccountUser') &&
        //            e.targetScope.state.current.views.hasOwnProperty('subContent@app.myAccountUser')) {
        //        }
        //        else if (curState.views != null && e.targetScope.state.current.views != null &&
        //            curState.views.hasOwnProperty('subContent@app.knowledgeDiscovery') &&
        //            e.targetScope.state.current.views.hasOwnProperty('subContent@app.knowledgeDiscovery')) {
        //        }
        //        else if (curState.views != null && e.targetScope.state.current.views != null &&
        //            curState.name.indexOf('app.myAccountUser.submissions') != -1 &&
        //            e.targetScope.state.current.name.indexOf('app.myAccountUser.submissions') != -1) {
        //        }
        //        else {
        //            document.body.scrollTop = document.documentElement.scrollTop = 0;
        //        }
        //    } catch (error) {

        //    }
        //    $rootScope.loadingProgress = true;
        //});

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function (e, curState) {
            // FPT add for Title page, and scoll to Top
          $rootScope.title = $state.current.title;
          $rootScope.currentUrl = $state.$current.url.source;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
            $rootScope.userInfo = accountApi.getUserInfo();
            //$rootScope.activeTopMenu();
          //$rootScope.activeLeftMenu();
            if (!localStorage.getItem('access-token') && !$rootScope.redirectState && $state.current.name !== 'app.pages_about_tnc') {
                if ($state.current.name !== 'app.pages_auth_login') {
                    $rootScope.redirectState = $state.current.name;
                    $rootScope.redirectParams = $state.params;
                }
                $state.go('app.pages_auth_login');
            } else if (localStorage.getItem('access-token') && $rootScope.redirectState) {
                $state.go($rootScope.redirectState, { id: $rootScope.redirectParams.id });
                $rootScope.redirectState = null;
                $rootScope.redirectParams = null;
            }

            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();
