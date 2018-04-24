
(function ()
{
    'use strict';

    angular
        .module('app.categories')
        .controller('CategoriesController', CategoriesController);

    /** @ngInject */
    function CategoriesController(CategotieslApi, logger,$scope)
    {
        var vm = this;
        $scope.disable = true;
        var xpublic,ypublic;
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

        vm.saveItem = function () {
            vm.errortext = "";
            var flag=-1;
            
            if (xpublic==0){
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
                         $("#btn_save").show();
                         $("#btn_add").hide();
                         $("#btn_cancel").show();
                          $("#btn_edit").prop( "disabled", false );
                      } else {
                        vm.errortext ='Changed Categories failed.';
                      }
                    });
              }
              else{
                vm.errortext = "The item is already in your shopping list.";
              }
            }else{
              var txt= $("#txt"+xpublic).val();
              if (!txt) {return;}
              var data = {
                id: xpublic,
                name: txt,
                description: txt
              }
              CategotieslApi.postSave(data).then(
                function (response) {
                  if (response.results != undefined) {
                    logger.success('Successfully');
                    $("#txt"+xpublic).prop( "disabled", true );
                    $("#btn_save").hide();
                    $("#btn_add").show();
                    $("#btn_cancel").hide();
                    $("#btn_edit").prop( "disabled", false );
                  } else {
                    logger.error('Fail');
                  }
                });
            }
            }
          vm.addItem = function(){
            xpublic=0;
            $("#btn_save").show();
            $("#btn_add").hide();
            $("#btn_cancel").show();
            $("#txtAdd").show();
          }
         vm.removeItem = function (x,y) {
                   vm.errortext = "";    
                   CategotieslApi.Delete(x).then(
                    function (response) {
                      if (response.results) {
                        vm.categories.splice(y, 1);
                        logger.success('Done');
                      }
                      else {
                        logger.error('Fail');
                      }
                    });
                }
        vm.editItem = function (x,y) {
          xpublic=x;
          ypublic=y;
                $("#txt"+x).prop( "disabled", false );
                $("#btn_edit").prop( "disabled", true );
                $("#btn_add").hide();
                $("#btn_save").show();
                $("#btn_cancel").show();
          }  
          vm.cancelItem = function () {
                  $("#btn_save").hide();
                  $("#btn_cancel").hide();
                  $("#btn_add").show();
                  $("#txtAdd").hide();
                  $("#txt"+xpublic).prop( "disabled", true );
            }    

    }
})();
