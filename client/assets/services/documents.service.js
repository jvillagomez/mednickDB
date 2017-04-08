(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('DocumentsService', DocumentsService);

    DocumentsService.$inject = ['$resource', 'MednickConfig'];

    function DocumentsService($resource, MednickConfig) {
        return $resource(MednickConfig.apiUrl + '/cabinet/', {}, {
            'save': {
                method: 'POST',
                transformRequest: function(data) {
                    var fd = new FormData();
                    angular.forEach(data, function(value, key) {
                        fd.append(key, value);
                        if (value.constructor === Array) {
                            angular.forEach(value, function(file, i) {
                                fd.append(key, file)
                            })
                        }
                    });
                    return fd;
                },
                headers: { 'Content-Type': undefined }
            },
            'queryIncomplete': {
                method: 'GET',
                url: MednickConfig.apiUrl + '/desk/',
                isArray: true
            }
        });
    }

})();
