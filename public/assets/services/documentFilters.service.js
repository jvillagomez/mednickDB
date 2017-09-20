(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('DocumentFiltersService', DocumentFiltersService);

    DocumentFiltersService.$inject = ['$resource', 'MednickConfig'];

    function DocumentFiltersService($resource, MednickConfig) {
        var url = MednickConfig.apiUrl;

        var DocumentFiltersResource = $resource(url + '/filterfiles',
            {
                study: '@fileStudy',
                visit: '@fileVisit'
            },
            {
                'queryStudies':{
                    method: 'GET',
                    url: url + '/Studies',
                    isArray: true
                },
                'queryVisits':{
                    method: 'GET',
                    params: {
                        fileStudy: '@fileStudy'
                    },
                    url: url + '/Visits',
                    isArray: true
                },
                'querySessions':{
                    method: 'GET',
                    params: {
                        fileStudy: '@fileStudy',
                        fileVisit: '@fileVisit'
                    },
                    url: url + '/Sessions',
                    isArray: true
                },
                'queryDocumentTypes':{
                    method: 'GET',
                    url: url + '/DocumentTypes',
                    isArray: true
                }
            }
        );
        return DocumentFiltersResource;
    }
})();
