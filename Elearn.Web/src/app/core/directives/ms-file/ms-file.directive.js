(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('fileModel', function () {
            return {
                restrict: 'EA',
                scope: {
                    setFileData: '&'
                },
                link: function (scope, ele, attrs) {
                    ele.on('change', function () {
                        var index = 0;
                        var tempFiles = [];
                        scope.setFileData({ files: ele[0].files });
                        // readNext();

                        // function readNext() {
                        //     var file = ele[0].files[index++];
                        //     var fr = new FileReader();
                        //     fr.onload = function (e) {
                        //         tempFiles.push({ value: file, url: e.target.result });
                        //         if (index < ele[0].files.length) {
                        //             readNext();
                        //         } else {
                        //             scope.setFileData({ files: tempFiles });
                        //             scope.$apply();
                        //         }
                        //     }
                        //     fr.readAsDataURL(file);
                        // }


                    });

                   
                }
            };

        });
})();