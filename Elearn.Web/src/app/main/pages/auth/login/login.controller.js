(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(appConfig,accountApi, $window, $state, $http) {
        var vm = this;
        vm.isValid = true;
        vm.loading = false;
        vm.domains = [{'id':1, 'name':'PETRONAS'}];
        //AccountApi.getDomains().then(function (data) {
        //    vm.domains = data;
        //});
      vm.selectedDomain = vm.domains[0];
        vm.login = login;
        // Data

        // Methods
        function login() {
            vm.loading = true;
            var postData = {
                userId: vm.form.userId,
                password: vm.form.password,
                domain: vm.selectedDomain.name,
                applicationId: appConfig.applicationId,
                client: {
                    ip: '127.0.0.1',
                    hostname: 'Test',
                    userAgent: 'Test'
                }
            };
          
          accountApi.api.login.save({}, postData,
                // Success
        
                function (response) {
                  $http.defaults.headers.common['AccessToken'] = response.accessToken;
                  $http.defaults.headers.common['Domain'] = response.Domain;
                    $window.localStorage['access-token'] = CryptoJS.AES.encrypt(response.accessToken, appConfig.passwordKey).toString();
                    accountApi.getUserLogin().then(
                    function (data) {
                      $window.localStorage.UserInfo = JSON.stringify(data);
                      $state.go('app.home');
                    },
                      // Error
                    function() {
                      vm.isValid = false;
                    }
                  );
                },

                // Error
                function (response) {
                    vm.loading = false;
                    vm.isValid = false;
                }
            )
        }
    }
})();
