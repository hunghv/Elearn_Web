(function () {
  'use strict';

  angular
    .module('app.masterdata')
    .controller('BrandController', BrandController);

  /** @ngInject */
  function BrandController($mdSidenav, $scope, $state, homeApi, $timeout, accountApi, masterDataApi) {
    var vm = this;
    $scope.tabName = 'Brand';

    vm.userInfo = accountApi.getUserInfo();
    $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician";
      }) > -1;

    $scope.canDeleteReport = _.findIndex(vm.userInfo.roles,
      function (o) {
        return o === "Admin" || o === "Engineer" || o === "Technician" || o === "Manager";
      }) > -1;




    //var init = function () {
    //  masterDataApi.getWorkTypeTree().then(function (data) {
    //    $scope.dataSource = data;
    //  });
    //}

    //init();

    $scope.dataSource = new kendo.data.HierarchicalDataSource({
      transport: {
        read: function(options) {
          return masterDataApi.getBrandTreeSource(options);
        }
      },
      schema: {
        model: {
          children: "items"
        }
      }
    });

    $scope.treeViewOptions = {
      dataSource: $scope.dataSource,
      dataTextField: "name",
      dataSpriteCssClassField: "spriteCssClass"
    }

    $scope.doSubmit = function () {
      var validator = $("#reportPopup").kendoValidator({
        rules: {
          requireField: function (input) {
            if (input.is("[data-required-msg]")) {
              return !_.isEmpty(input.val());
            }
            return true;
          }
        },
        messages: {
          requireField: 'Mandatory field.'
        }
      }).data("kendoValidator");

      if (validator.validate()) {
        if ($scope.actionName === "Create") {
          if ($scope.dataItem.type === "Root") {
            masterDataApi.saveBrand("", $scope.newWorkType, "Create").then(function (data) {
              $scope.treeViewOptions.dataSource.read();
              $('#dataPopup').modal('hide');
              toastr.success('Create Success', 'Report');
            },
              function(error) {
                console.error(error);
              });
          } else {
            var parentId = $scope.dataItem.parentId == undefined ? $scope.dataItem.id : $scope.dataItem.parentId;
            masterDataApi.saveBrandType("", $scope.newWorkType, parentId, "Create").then(function (data) {
              $scope.treeViewOptions.dataSource.read();
              $('#dataPopup').modal('hide');
              toastr.success('Create Success', 'Report');
            },
              function (error) {
                console.error(error);
              });
          }
        
        } else {
          if ($scope.dataItem.type === "Brand") {
            masterDataApi.saveBrand($scope.dataItem.id, $scope.newWorkType, "Edit").then(function (data) {
              if (data) {
                $scope.treeViewOptions.dataSource.read();
                $('#dataPopup').modal('hide');
                toastr.success('Edit Success', 'Report');
              } else {
                $('#dataPopup').modal('hide');
                toastr.warning('Item was not existed or already existed', 'Report');
              }
            },
              function (error) {
                console.error(error);
              });
          } else {
            masterDataApi.saveBrandType($scope.dataItem.id, $scope.newWorkType, $scope.dataItem.parentId, "Edit").then(function (data) {
              if (data) {
                $scope.treeViewOptions.dataSource.read();
                $('#dataPopup').modal('hide');
                toastr.success('Edit Success', 'Report');
              } else {
                $('#dataPopup').modal('hide');
                toastr.warning('Item was not existed or already existed', 'Report');
              }
            },
              function (error) {
                console.error(error);
              });
          }
        }
      }
    }

    $("#tree-context-menu").kendoContextMenu({
      target: "#treeData",
      name:"parent",
      filter: ".k-in",
      alignToAnchor: true,
      close: function (e) {
        var contextMenu = $("#tree-context-menu").data("kendoContextMenu");

        contextMenu.bind("open", handler);
        setTimeout(function () {
            contextMenu.unbind("open", handler);
          },
          0);
      },
      //open: function (e) {
      //  var node = $(e.target);
      //  var treeView = $("#treeData").data("kendoTreeView");
      //  var data = treeView.dataItem(node);
      //  if (data.type === "Root")
      //    e.preventDefault();
      //},
      select: function (e) {
        var button = $(e.item);
        var node = $(e.target);
        var treeView = $("#treeData").data("kendoTreeView");
        var data = treeView.dataItem(node);
        $scope.dataItem = _.pick(data, ['id', 'uid', 'name','parentId','type']);
        var action = button.text();
        $scope.actionName = action;
        $('#tree-context-menu').data('kendoContextMenu').close('li');
       
        switch (action) {
          case "Create":
            if ($scope.dataItem.type === "Root") {
              $scope.BrandName = "Brand";
            } else {
              $scope.BrandName = "BrandType";
            }

            $scope.newWorkType = "";
            $scope.$digest();
          $('#dataPopup').modal('show');
          break;
          case "Edit":
            if ($scope.dataItem.type === "Root")
              return;
            if ($scope.dataItem.type === "Brand") {
              $scope.BrandName = "Brand";
            } else {
              $scope.BrandName = "BrandType";
            }

            $scope.newWorkType = $scope.dataItem.name;
            $scope.$digest();
          $('#dataPopup').modal('show');
          break;
          case "Delete":
            if ($scope.dataItem.type === "Root")
              return;
            if ($scope.dataItem.type === "Root")
              return;
            if ($scope.dataItem.type === "Brand") {
              $scope.BrandName = "Brand";
            } else {
              $scope.BrandName = "BrandType";
            }
            if ($scope.dataItem.type === "Brand") {
              if (window.confirm("Would you like to delete this item?")) {
                masterDataApi.saveBrand($scope.dataItem.id, "", "Delete").then(function (data) {
                  if (data) {
                    $scope.treeViewOptions.dataSource.read();
                    $('#dataPopup').modal('hide');
                    toastr.success('Deleted Success', 'Report');
                  } else {
                    $('#dataPopup').modal('hide');
                    toastr.warning('Item was not existed or already existed', 'Report');
                  }
                },
                  function(error) {
                    console.error(error);
                  });
              };
            } else {
              if (window.confirm("Would you like to delete this item?")) {
                masterDataApi.saveBrandType($scope.dataItem.id, "",0, "Delete").then(function (data) {
                  if (data) {
                    $scope.treeViewOptions.dataSource.read();
                    $('#dataPopup').modal('hide');
                    toastr.success('Deleted Success', 'Report');
                  } else {
                    $('#dataPopup').modal('hide');
                    toastr.warning('Item was not existed or already existed', 'Report');
                  }
                },
                  function(error) {
                    console.error(error);
                  });
              };
            }
        
          break;
        }
      }
    });


    var handler = function (e) {
      e.preventDefault();
    };


    // End
  }
})();