(function () {
  'use strict';

  angular
    .module('app.home')
    .factory('ReportShareService', ReportShareService);

  /** @ngInject */
  function ReportShareService(accountApi) {

    // Field
    var currentHomeTab = "All";
    var currentAdminRoleTab = "All";
    var currentIndicatorTab = 1;

    var dailyActionReport = {
      action: "Create",
      id: 0
    };

    // Function

    function setCurrentIndicatorTab(tab) {
      currentIndicatorTab = tab;
    };

    function getCurrentIndicatorTab() {
      return currentIndicatorTab;
    };

    function setCurrentHomeTab(tab) {
      currentHomeTab = tab;
    };

    function getCurrentHomeTab() {
      return currentHomeTab;
    };

    function setCurrentAdminRoleTab(tab) {
      currentAdminRoleTab = tab;
    };

    function getCurrentAdminRoleTab() {
      return currentAdminRoleTab;
    };

    function setActionReport(action) {
      dailyActionReport = action;
    };

    function getActionReport() {
      return dailyActionReport;
    };

    function canSaveReport() {
      var userInfo = accountApi.getUserInfo();
      return _.findIndex(userInfo.roles,
        function (o) {
          return o === "Admin" || o === "Engineer" || o === "Technician";
        }) > -1;
    }

    function isAdmin() {
      var userInfo = accountApi.getUserInfo();
     return _.findIndex(userInfo.roles,
        function (o) {
          return o === "Admin";
        }) > -1;
    }

    return {
      setCurrentHomeTab: setCurrentHomeTab,
      getCurrentHomeTab: getCurrentHomeTab,
      setActionReport: setActionReport,
      getActionReport: getActionReport,
      getCurrentAdminRoleTab: getCurrentAdminRoleTab,
      setCurrentAdminRoleTab: setCurrentAdminRoleTab,
      canSaveReport: canSaveReport,
      isAdmin: isAdmin,
      setCurrentIndicatorTab: setCurrentIndicatorTab,
      getCurrentIndicatorTab: getCurrentIndicatorTab
    };
  }

})();
