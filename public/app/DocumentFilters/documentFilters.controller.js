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

        vm.getVisits()

        vm.view = viewDoc;
        // ======================================



        init();

        function init() {
            getStudies();
            getVisits();
            // getSessions();
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
                    // fileStudy: "CFS"
                },
                function(data) {
                    vm.visits = data
                    console.log(data);
                }
            )
        }

        function getSessions() {
            return DocumentFiltersService.querySessions(
                {
                    fileStudy: "CFS",
                    fileVisit: "v1"
                },
                function(data) {
                    vm.visits = data
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
