

(function () {
  'use strict';

  angular
    .module('app.masterdata')
    .controller('ConstainDataController', ConstainDataController);

  /** @ngInject */
  function ConstainDataController($mdSidenav, $scope, $state, homeApi, $timeout, accountApi, masterDataApi) {
    var vm = this;
    $scope.actionName = 'Create';
    $scope.pageSize = 10;
    $scope.tabName = 'Constraint';

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
        read: function (options) {
          return masterDataApi.getConstraintTreeSource(options);
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
          masterDataApi.saveConstraint("", $scope.newWorkType, "Create").then(function (data) {
            $scope.treeViewOptions.dataSource.read();
            $('#dataPopup').modal('hide');
            toastr.success('Create Success', 'Report');
          });
        } else if ($scope.actionName === "Edit") {

          masterDataApi.saveConstraint($scope.dataItem.id, $scope.newWorkType, "Edit").then(function (data) {
            if (data) {
              $scope.treeViewOptions.dataSource.read();
              $('#dataPopup').modal('hide');
              toastr.success('Edit Success', 'Report');
            } else {
              $('#dataPopup').modal('hide');
              toastr.warning('Item was not existed or already existed', 'Report');
            }
          });
        }
      }
    }

    $("#tree-context-menu").kendoContextMenu({
      target: "#treeData",
      name: "parent",
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
      select: function (e) {
        var button = $(e.item);
        var node = $(e.target);
        var treeView = $("#treeData").data("kendoTreeView");
        var data = treeView.dataItem(node);
        $scope.dataItem = _.pick(data, ['id', 'uid', 'name', 'type']);
        var action = button.text();
        $scope.actionName = action;
        $('#tree-context-menu').data('kendoContextMenu').close('li');

        switch (action) {
          case "Create":
            $scope.newWorkType = "";
            $scope.$digest();
            $('#dataPopup').modal('show');
            break;
          case "Edit":
            if ($scope.dataItem.type === "Root")
              return;
           
            $scope.newWorkType = $scope.dataItem.name;;
            $scope.$digest();
            $('#dataPopup').modal('show');
            break;
          case "Delete":
            if ($scope.dataItem.type === "Root")
              return;
           
            if (window.confirm("Would you like to delete this item?")) {
              masterDataApi.saveConstraint($scope.dataItem.id, "", "Delete").then(function (data) {
                if (data) {
                  $scope.treeViewOptions.dataSource.read();
                  $('#dataPopup').modal('hide');
                  toastr.success('Deleted Success', 'Report');
                } else {
                  $('#dataPopup').modal('hide');
                  toastr.warning('Item was not existed or already existed', 'Report');
                }
              });
            };
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