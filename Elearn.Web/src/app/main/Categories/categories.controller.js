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
                    
            if (!vm.addMe) {return;}
             if (vm.categories.indexOf(vm.addMe) == -1) {
                vm.categories.push(vm.addMe);
             } 
             else {
                 vm.errortext = "The item is already in your shopping list.";
             }
             var data = {
                 id: vm.categories.Id,
                 name: vm.addMe,
                 description:  vm.addMe
               }
               CategotieslApi.postSave(data).then(
                function (response) {
                  if (response.id == true) {
                    $log.info('Changed collection successfully.');
                  }
                  else {
                    $log.info('Changed collection failed.');
                  }
                });
            }
         vm.removeItem = function (x) {
                   vm.errortext = "";    
                   vm.products.splice(x, 1);
                }
    }
})();
