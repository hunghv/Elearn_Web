(function ()
{
    'use strict';

    angular
        .module('fuse')
        .constant('appConfig', {
        UrlProduction: '',
        SkillApi: 'http://localhost:51571/',
        //SSOApi: 'http://10.14.68.12:8090/',
        ////  SSOApi: 'https://sso.petronas.com/',
        applicationId: 'b3c932ea-872d-4857-8561-99a04f3f0127',
        passwordKey: '91ca435f-19d1-480b-b85d-6226de85f5b0',
        // introduction: ['/assets/images/SKILL_PopUp(SVP).png','/assets/images/SKILL_PopUp(KMA).jpg'],
        //introduction: ['/assets/images/logos/SKILL_POPUP.gif'],
        allowFileExtension: ['jpg', 'png', 'pdf', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx', 'mp4', 'mp3', 'webm'],
        allowImageExtension: ['jpg','png'],
        maxFileSize: 50,
        errors: {
        }
      })
      .constant('Message', {
        Msg1: 'Mandatory field.',
        Msg2: 'Please enter at least 20 characters.',
        Msg3: 'Please select at least one sub discipline for primary discipline.'
      });
})();

  