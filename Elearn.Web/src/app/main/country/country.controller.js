
(function ()
{
    'use strict';

    angular
        .module('app.country')
        .controller('countryController', countryController);

    /** @ngInject */
    function countryController(countryApi, $log)
    {
        var vm = this;
        vm.country = [];
        vm.countryPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 12,
            sortField: "id",
            sortDir: "asc",
            isExport: true,
          };
        vm.GetAll = function () {
            var data = {
                skip: (vm.countryPagging.pageIndex - 1) * vm.countryPagging.pageSize,
                take: vm.countryPagging.pageSize,
                sortField: vm.countryPagging.sortField,
                sortDir: vm.countryPagging.sortDir,
                isExport: vm.countryPagging.isExport,
              };
              countryApi.getAll({ pagging: data }).then(
                 function (response) {
                  vm.country = response.data;
                  vm.countryPagging.total = vm.country.total;
                },
                  function (response) {
                  });
        }
        vm.GetAll();

        vm.addItem = function () {
            vm.errortext = "";
            var flag=-1;
            if (!vm.addMe) {return;}
            var data = {
                id: vm.country.Id,
                countryName: vm.addMe,
              }
              for(var i = 0; i < vm.country; i += 1){
                  if( vm.country[i].countryName === vm.addMe){
                    flag=i;
                  }
              }
              if(flag===-1){
                countryApi.postSave(data).then(
                    function (response) {
                      if (response.results != undefined) {
                        vm.errortext ='Done!';
                        var data = {
                            id: response.results,
                            countryName: vm.addMe,
                          }
                         vm.country.push(data);
                      } else {
                        vm.errortext ='Changed Categories failed.';
                      }
                    });
              }
              else{
                vm.errortext = "The item is already in your shopping list.";
              }
            }

         vm.removeItem = function (x,y) {
                   vm.errortext = "";    
                   countryApi.Delete(x).then(
                    function (response) {
                      if (response.results) {
                        vm.country.splice(y, 1);
                        vm.errortext ='Deleted categories successfully.';
                      }
                      else {
                        vm.errortext ='Deleted categories failed.';
                      }
                    });
                }
    }
})();
