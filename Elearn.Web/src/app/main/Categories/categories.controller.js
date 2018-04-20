
(function ()
{
    'use strict';

    angular
        .module('app.categories')
        .controller('CategoriesController', CategoriesController);

    /** @ngInject */
    function CategoriesController(CategotieslApi, $log)
    {
        var vm = this;
        vm.categories = [];
        vm.categoriesPagging = {
            total: 0,
            pageIndex: 1,
            pageSize: 12,
            sortField: "id",
            sortDir: "asc",
            isExport: true,
          };
        vm.GetAll = function () {
            var data = {
                skip: (vm.categoriesPagging.pageIndex - 1) * vm.categoriesPagging.pageSize,
                take: vm.categoriesPagging.pageSize,
                sortField: vm.categoriesPagging.sortField,
                sortDir: vm.categoriesPagging.sortDir,
                isExport: vm.categoriesPagging.isExport,
              };
              CategotieslApi.getAll({ pagging: data }).then(
                 function (response) {
                  vm.categories = response.data;
                  vm.categoriesPagging.total = vm.categories.total;
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
                id: vm.categories.Id,
                name: vm.addMe,
                description:  vm.addMe
              }
              for(var i = 0; i < vm.categories; i += 1){
                  if( vm.categories[i].name === vm.addMe){
                    flag=i;
                  }
              }
              if(flag===-1){
                CategotieslApi.postSave(data).then(
                    function (response) {
                      if (response.results != undefined) {
                        vm.errortext ='Done!';
                        var data = {
                            id: response.results,
                            name: vm.addMe,
                            description:  vm.addMe
                          }
                         vm.categories.push(data);
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
                   CategotieslApi.Delete(x).then(
                    function (response) {
                      if (response.results) {
                        vm.categories.splice(y, 1);
                        vm.errortext ='Deleted categories successfully.';
                      }
                      else {
                        vm.errortext ='Deleted categories failed.';
                      }
                    });
                }
    }
})();
