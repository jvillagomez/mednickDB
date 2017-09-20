(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('RecordsService', RecordsService);

    RecordsService.$inject = ['$resource', 'MednickConfig'];

    function RecordsService($resource, MednickConfig) {
        return $resource(MednickConfig.apiUrl + '/records', {}, {
            'queryProfiles': {
                method: 'GET',
                url: MednickConfig.apiUrl + '/records',
                isArray: true
            }
        });
    }
})();
