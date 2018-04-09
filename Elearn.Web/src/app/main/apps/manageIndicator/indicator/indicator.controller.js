(function () {
  'use strict';

  angular
    .module('app.adminindicator')
    .controller('IndicatorController', IndicatorController);

  /** @ngInject */
  function IndicatorController($mdSidenav,
    $scope,
    $state,
    $rootScope,
    $q,
    $timeout,
    manageIndicatorApi,
    ReportShareService) {
    var vm = this;

    var currentTab = ReportShareService.getCurrentIndicatorTab();

    $scope.condition1 = [
      {
        id: 1,
        name: ">"
      },
      {
        id: 10,
        name: ">="
      }
    ];

    $scope.condition2 = [
      {
        id: -1,
        name: "<"
      },
      {
        id: -10,
        name: "<="
      }
    ];

    $scope.productsDataSource = {
      data: [
        {
          id: 1,
          name: ">"
        },
        {
          id: 10,
          name: ">="
        }
      ]
    };

    $scope.gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          return manageIndicatorApi.getIndicatorTab(currentTab, options);
        },
        destroy: function (options) {
          var id = options.data.models[0].id;
          manageRoleApi.deleteUserRole(id).then(function (data) {
            $('.report-grid').data('kendoGrid').dataSource.read();
            $('.report-grid').data('kendoGrid').refresh();
          });
        },
        parameterMap: function (options, operation) {
        }
      },
      batch: true,
      serverFiltering: false,
      serverSorting: false,
      serverPaging: false,
      pageSize: $scope.pageSize,
      schema: {
        data: function (e) {
          return e.data;
        },
        total: "total",
        model: {
          id: "id",
          fields: {
            name: { type: "string" },
            green: { type: "string" },
            yellow: { type: "string" },
            red: { type: "object" },
            conditionOne: { type: "number" },
            conditionTwo: { type: "number" }
          }
        }
      }
    });

    $scope.onConditionOneChange = function onConditionOneChange($event) {
      console.log($event.item);
    }

    $scope.conditionOneOptions = {
      dataSource: $scope.condition1,
      dataTextField: "name",
      dataValueField: "id"
    };

    $scope.conditionTwoOptions = {
      dataSource: $scope.condition2,
      dataTextField: "name",
      dataValueField: "id"
    };

    //$scope.maxNumberOptions = {
    //  spin: function (e) {
    //    debugger;
    //  }
    //};

    $scope.onSpin = function (e) {
      $scope.maxValue = e.maxValue;
      //$scope.$digest();
    }

    $scope.numbericOneOptions = {
      min: 0,
      decimals: 0,
    format:"0",
    max: 99999999,
      step: 1
    }

    $scope.numbericTwoOptions = {
      min: 0,
      decimals: 0,
      format:"0",
      max: 99999999,
      step: 1
    }

    //Grid definition
    $scope.mainGridOptions = {
      pageable: false,
      scrollable: false,
      sortable: false,
      filter: false,
      selectable: false,
      //define dataBound event handler
      dataSource: $scope.gridDataSource,
      columns: [
        //define template column with checkbox and attach click event handler
        {
          field: "id",
          hidden: true,
          attributes: {
            "class": "unique-id-hidden"
          }
        },
        {
          field: "name",
          title: "Indicator",
          width: "15%"
        },
        {
          field: "green",
          title: "Green",
          width: "200px"
        },
        {
          field: "yellow",
          title: "Yellow",
          width: "200px"
        },
        {
          field: "red",
          title: "Red",
          width: "200px"
        },
        {
          command: ["edit"],
          title: "&nbsp&nbsp&nbspAction",
          width: "10%"
        }
      ],
      editable: {
        mode: "popup",
        template: function (item) {
          if(item.name === "Area of Rectification")
            {return $("#editorTemplate3").html();}
          return $("#editorTemplate").html();
        }
      },
      edit: function(e) {
        debugger;
        $scope.indicatorName = "";
        $scope.indicatorName = e.model.name;
        $scope.maxValue = e.model.max;
        $scope.minValue = e.model.min;
        $scope.conditionOne = e.model.conditionOne;
        $scope.conditionTwo = e.model.conditionTwo;
        $scope.$digest();
      },
      save: function(e) {
        e.preventDefault();
        if (e.model.max >= e.model.min) {
          toastr.warning('Max value should be greater than Min value', 'Report');
          return;
        }
        var request = new Object();
        request.id = e.model.id;
        request.max = e.model.max;
        request.min = e.model.min;
        request.conditionOne = e.model.conditionOne;
        request.conditionTwo = e.model.conditionTwo;
        manageIndicatorApi.saveIndicator(request).then(function(data) {
          toastr.success('Save Success', 'Report');
          $('.report-grid').data('kendoGrid').dataSource.read();
          $('.report-grid').data('kendoGrid').refresh();
        });
      }
    }
  };

})();