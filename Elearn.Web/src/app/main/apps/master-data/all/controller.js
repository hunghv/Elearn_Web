(function () {
    'use strict';

    angular
      .module('app.masterdata')
      .controller('MasterDataAreaController', MasterDataAreaController);

    /** @ngInject */
  function MasterDataAreaController($mdSidenav, $scope, $state, homeApi, $timeout, accountApi, masterDataApi) {
    var vm = this;
    $scope.actionName = 'Create';
    $scope.dataItem = {
      id: 0,
      parentId: 0,
      name: '',
      type: ''
    };

    $scope.tabName = 'Area, Unit, Instrumentation Group, Instrumentation Type and Failure Sub-Type';

    vm.area = {};

    vm.userInfo = accountApi.getUserInfo();
    $scope.canCreateReport = _.findIndex(vm.userInfo.roles,
        function(o) {
          return o === "Admin" || o === "Engineer" || o === "Technician";
        }) >
      -1;

    $scope.canDeleteReport = _.findIndex(vm.userInfo.roles,
        function(o) {
          return o === "Admin" || o === "Engineer" || o === "Technician" || o === "Manager";
        }) >
      -1;

    $scope.dataSource = new kendo.data.HierarchicalDataSource({
      transport: {
        read: function(options) {
          return masterDataApi.getAreaTree(options);
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
      dataTextField: "name"
    }

  $("#tree-context-menu").kendoContextMenu({
            target: "#treeData",
            //showOn: "click contextmenu",
            // filter: "td.divActions a",
            filter: ".k-group.k-treeview-lines .k-group .k-in",
            alignToAnchor: true,
            open: function (e) {
              var node = $(e.target);
              var treeView = $("#treeData").data("kendoTreeView");
              var data = treeView.dataItem(node);
              if (!data.canUpdate)
                e.preventDefault();
            },
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var action = button.text();
                var menuText = node.text();
                $scope.actionName = action;
                var data = $("#treeData").data("kendoTreeView").dataItem(node);
                $scope.dataItem = _.pick(data, ['id', 'name','uid', 'parentId','type','color']);
                $scope.dataItem.action = $scope.actionName;
                if (action == 'Create') { 
                    $scope.newItem = '';
                  $scope.$digest();
                  $('#dataPopup').modal('show');
                } else if (action == 'Edit') {
                  if ($scope.dataItem.type.indexOf('Root') >= 0)
                    return;
                  $scope.newItem = $scope.dataItem.name;
                  $scope.color = $scope.dataItem.color;
                  $scope.$digest();
                  $('#dataPopup').modal('show');
              } else if (action == 'Delete') {
                $scope.dataItem.name = '';
                $scope.$digest();
                if (window.confirm("Are you sure you want to delete this item from master data?")) {
                  debugger;
                  masterDataApi.saveArea($scope.dataItem.id, "", $scope.dataItem.parentId,$scope.dataItem.color, "Delete", $scope.dataItem.type).then(function (data) {
                    $scope.treeViewOptions.dataSource.read();
                    $('#dataPopup').modal('hide');
                  });
                  return;
                } else return;
              }

              
            }
  });

  $("#tree-context-menu-root").kendoContextMenu({
    target: "#treeData",
    //showOn: "click contextmenu",
    // filter: "td.divActions a",
    filter: ".k-group.k-treeview-lines .k-in",
    alignToAnchor: true,
    select: function (e) {
      var button = $(e.item);
      var node = $(e.target);
      var action = button.text();
      var menuText = node.text();
      $scope.actionName = action;
      var data = $("#treeData").data("kendoTreeView").dataItem(node);
      $scope.dataItem = _.pick(data, ['id', 'name','uid', 'parentId', 'type']);

      $scope.dataItem.action = $scope.actionName;
      if (action == 'Create') {
        $scope.newItem = '';
        $scope.$digest();
        $('#dataPopup').modal('show');
      } 
    }
  });

        // End

        $scope.doSubmit = function () {
            var reportPopup = $("#reportPopup").kendoValidator().data("kendoValidator");
            if (reportPopup.validate()) {
              if ($scope.actionName === "Create") {
                masterDataApi.saveArea("", $scope.newItem, $scope.dataItem.parentId,$scope.color, "Create", $scope.dataItem.type).then(function (data) {
                  $scope.treeViewOptions.dataSource.read();
                  $('#dataPopup').modal('hide');
                  toastr.success('Create Success', 'Report');
                });
              } else {
                masterDataApi.saveArea($scope.dataItem.id, $scope.newItem, $scope.dataItem.parentId,$scope.color, "Edit", $scope.dataItem.type).then(function (data) {
                  if (data) {
                    var treeview = $("#treeData").data("kendoTreeView");
                    var barElement = treeview.findByUid($scope.dataItem.uid);
                    var data = $("#treeData").data("kendoTreeView").dataItem(barElement);
                    data.name = $scope.newItem;
                    data.color = $scope.color;
                    debugger;
                    treeview.text(barElement, $scope.newItem);
                    // $scope.treeViewOptions.dataSource.read();
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
    }
})();

