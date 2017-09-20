(function() {
    'use strict';

    angular
        .module('DocumentFilters')
        .controller('DocumentFiltersController', DocumentFiltersController);

    DocumentFiltersController.$inject = ['DocumentFiltersService', '$window'];

    function DocumentFiltersController(DocumentFiltersService, $window) {
        var vm = this;
        vm.studies = [];
        vm.visits = [];
        vm.sessions = [];
        vm.documentTypes = [];
        // ======================================
        vm.studyParameter = "";
        vm.visitParameter = "";
        vm.sessionParameter = "";
        vm.documentTypeParameter = "";

        vm.getVisits = getVisits;
        vm.getSessions = getSessions;

        vm.view = viewDoc;
        // ======================================
        init();

        function init() {
            getStudies();
            getDocumentTypes();
        }

        function viewDoc(url) {
            $window.open(url, '_blank');
        }

        function getStudies() {
            return DocumentFiltersService.queryStudies(function(data) {
                vm.studies = data
            })
        }

        function getVisits() {
            console.log("hitting GetVisits");
            return DocumentFiltersService.queryVisits(
                {
                    fileStudy: vm.studyParameter
                },
                function(data) {
                    vm.visits = data
                    console.log(data);
                }
            )
        }

        function getSessions() {
            console.log("hitting GetSessions");
            console.log(vm.studyParameter);
            console.log(vm.visitParameter);
            return DocumentFiltersService.querySessions(
                {
                    fileStudy: vm.studyParameter,
                    fileVisit: vm.visitParameter
                },
                function(data) {
                    vm.sessions = data
                    console.log(data);
                }
            )
        }

        function getDocumentTypes() {
            return DocumentFiltersService.queryDocumentTypes(function(data) {
                vm.documentTypes = data
            })
        }
    }
})();
