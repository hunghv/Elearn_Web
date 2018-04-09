(function () {
  'use strict';

  angular
    .module('app.masterdata')
    .controller('QTYDataController', QTYDataController);

  /** @ngInject */
  function QTYDataController($mdSidenav, $scope, $state, homeApi, $timeout, accountApi, masterDataApi, moment) {
    var vm = this;
    $scope.actionName = 'Create';
    $scope.pageSize = 10;
    $scope.tabName = 'QTY Number';

    $scope.numbericOptions = {
      min: 0,
      max: 1000000000000,
      step: 1,
      decimals: 0,
      restrictDecimals: true
    }

    $scope.dataSource = new kendo.data.HierarchicalDataSource({
      transport: {
        read: function (options) {
          return masterDataApi.getQtyTree(options);
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

    $scope.$watch("selectedItem",
      function() {
        $scope.dataItem = _.pick($scope.selectedItem, ['id', 'uid', 'name', 'parentId', 'type']);
        $("#dataPopupRange span.k-tooltip-validation").hide();
        if ($scope.dataItem.type !== "Group")
          return;
        var names = $scope.dataItem.name.split(':');
        $scope.qtyNumber = names[1];
        $('#dataPopup').modal('show');
      });

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

          masterDataApi.updateQtyNumber($scope.dataItem.id, $scope.qtyNumber).then(function (data) {
            if (data) {
              $('#dataPopup').modal('hide');
              var treeview = $("#treeData").data("kendoTreeView");
              var barElement = treeview.findByUid($scope.dataItem.uid);
              debugger;
              var names = $scope.dataItem.name.split(':');
              var newName = names[0] + ":" + $scope.qtyNumber;
              $scope.qtyNumber = names[1];
              treeview.text(barElement, newName);
              toastr.success('Edit Success', 'Report');
            } else {
              $('#dataPopup').modal('hide');
              toastr.warning('Item was not existed or already existed', 'Report');
            }
          });
        }
    }

    $scope.doSubmitRange = function () {
      var validator = $("#rangePopup").kendoValidator({
        rules: {
          requireField: function (input) {
            if (input.is("[data-required-msg]")) {
              return !_.isEmpty(input.val());
            }
            return true;
          },
          dateValid: function (input) {
            if (input.is("[data-greaterdate-msg]") && input.val() !== "") {
              var dateFormat = moment(input.val(), 'DD/MM/YYYY', true).format();
              var date = kendo.parseDate(dateFormat);
              var otherDateFormat = moment($("[name='" + input.data("greaterdateField") + "']").val(), 'DD/MM/YYYY', true).format();
              var otherDate = kendo.parseDate(otherDateFormat);

              return otherDate == null || otherDate.getTime() < date.getTime();
            }
            return true;
          }
        },
        messages: {
          requireField: 'Mandatory field.',
          dateValid: 'Start date must greater than End date'
        }
      }).data("kendoValidator");

      if (validator.validate()) {
        debugger;
        var startDate = moment($scope.startDate, 'DD/MM/YYYY', true).format();
        var endDate = moment($scope.endDate, 'DD/MM/YYYY', true).format();
        if ($scope.actionName === "Create") {
          var newRequest = {
            id: null,
            start: startDate,
            end: endDate
          }

          masterDataApi.saveQtyRange(newRequest).then(function (data) {
            debugger;
            if (data.isSuccess === true) {
              $scope.treeViewOptions.dataSource.read();
              //$timeout(function () {
              //    $(".k-group.k-treeview-lines .k-item .k-in").addClass("someCustomClass");
              //  },
              //  1000);
              $('#dataPopupRange').modal('hide');
              toastr.success('Create Success', 'Report');
            } else {
              $('#dataPopupRange').modal('hide');
              toastr.warning('Qty Range Can not be overlap date', 'Report');
            }
          },function(response) {
            console.log(response);
          });
        } else {
          var updateRequest = {
            id: $scope.dataItem.id,
            start: startDate,
            end: endDate
          }

          masterDataApi.saveQtyRange(updateRequest).then(function (data) {
            debugger;
            if (data.isSuccess === true) {
              $scope.treeViewOptions.dataSource.read();
              $('#dataPopupRange').modal('hide');
              toastr.success('Update Success', 'Report');
            } else {
              $('#dataPopupRange').modal('hide');
              toastr.warning('Qty Range Can not be overlap date', 'Report');
            }
          }, function (response) {
            console.log(response);
          });
        }
      }
    }

    $("#context-menu").kendoContextMenu({
      target: "#treeData",
      name: "parent1",
      filter: ".k-in",
      alignToAnchor: true,
      open: function (e) {
        var node = $(e.target);
        var treeView = $("#treeData").data("kendoTreeView");
        var data = treeView.dataItem(node);
        if (data.type === "Area" || data.type === "Group")
          e.preventDefault();
      },
      select: function (e) {
        var button = $(e.item);
        var node = $(e.target);
        var action = button.text();
        var treeView = $("#treeData").data("kendoTreeView");
        var data = treeView.dataItem(node);
        $scope.dataItem = _.pick(data, ['id', 'uid', 'name', 'parentId', 'type']);
        $scope.actionName = action;
        switch (action) {
          case "Create":
            $("#dataPopupRange span.k-tooltip-validation").hide();
            if (data.type === "Range" || data.type === "Root") {
              $scope.startDate = "";
              $scope.endDate = "";
              $scope.$digest();
              $('#dataPopupRange').modal('show');
            }
            break;
          case "Edit":
            if (data.type === "Root")
              return;
            $("#dataPopupRange span.k-tooltip-validation").hide();
            debugger;
            $scope.actionName = action;
              var dateStrs = data.name;
              var dateArr = dateStrs.split(':');
              var dateSplit = dateArr[1].split('-');
              var startDateStr = dateSplit[0].trim();
              var endDateStr = dateSplit[1].trim();
               $scope.startDate = startDateStr;
               $scope.endDate = endDateStr;
            //   $scope.startDate = moment(startDateStr, 'DD/MM/YYYY', true).format();
            //   $scope.endDate = moment(endDateStr, 'DD/MM/YYYY', true).format();
            // debugger;
              $scope.$digest();
              $('#dataPopupRange').modal('show');
            break;
          case "Delete":
            if (data.type === "Root")
              return;
              if (window.confirm("Would you like to delete this item?")) {
                masterDataApi.deleteQtyRange($scope.dataItem.id).then(function (data) {
                  if (data) {
                    $scope.treeViewOptions.dataSource.read();
                    $timeout(function () {
                        $(".k-group.k-treeview-lines .k-item .k-in").addClass("someCustomClass");
                      },
                      1000);
                    $('#dataPopupRange').modal('hide');
                    toastr.success('Deleted Success', 'Report');
                  } else {
                    $('#dataPopupRange').modal('hide');
                    toastr.warning('Item was not existed or already existed', 'Report');
                  }
                });
            }

            break;
        }
      }
    });

    $timeout(function () {
      $(".k-group.k-treeview-lines .k-item .k-in").addClass("someCustomClass");
    },
      1000);

    $timeout(function () {
      $("#treeData .k-group.k-treeview-lines .k-item .k-group .k-item>.k-in").addClass("someCustomClass");
      },
      1000);

    $timeout(function () {
      $(".k-group.k-treeview-lines .k-item .k-group .k-item .k-in").addClass("someCustomAreaClass");
      },
      1000);

    var handler = function (e) {
      e.preventDefault();
    };


    // End
  }
})();