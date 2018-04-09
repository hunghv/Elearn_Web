(function () {
  'use strict';

  angular
    .module('fuse')
    .constant('appConfig', {
      UrlProduction: '',
     
      /************ Local Dev Server Setting ************/
      ReportApi: 'http://localhost:12396/',
      //ReportApi: 'http://10.14.73.46:10089/',
      SSOApi: 'http://10.14.68.12:8090/',
      applicationId: 'b3c932ea-872d-4857-8561-99a04f3f0127',
      passwordKey: '91ca435f-19d1-480b-b85d-6226de85f5b0',
      errors: {
      },
      Statuses: {
        Draft: 'Draft',
        Submit: 'New',
        Ammend: 'Acknowledged'
      },
      pageSize: 25,
      pageSizes: [25,50,75,100]
    })
    .constant('Message', {
      Msg1: 'Mandatory field.',
      Msg2: 'Please enter at least 20 characters.'
    });
})();
