(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('DocumentsTableService', DocumentsTableService);

    DocumentsService.$inject = ['$resource', 'MednickConfig'];

    function DocumentsTableService($resource, MednickConfig) {
        return $resource(MednickConfig.apiUrl + '/files', {}, {
            // 'save': {
            //     method: 'POST',
            //     transformRequest: function(data) {
            //         var fd = new FormData();
            //         angular.forEach(data, function(value, key) {
            //             fd.append(key, value);
            //             if (value.constructor === Array) {
            //                 angular.forEach(value, function(file, i) {
            //                     fd.append(key, file)
            //                 })
            //             }
            //         });
            //         return fd;
            //     },
            //     headers: { 'Content-Type': undefined }
            // },
            'queryIncomplete': {
                method: 'GET',
                url: MednickConfig.apiUrl + '/TempFiles',
                isArray: true
            },
            'queryComplete': {
                method: 'GET',
                url: MednickConfig.apiUrl + '/Files',
                isArray: true
            }
        });
    }

})();
