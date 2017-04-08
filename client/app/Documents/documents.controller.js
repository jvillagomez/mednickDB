(function() {
    'use strict';

    angular
        .module('Documents')
        .controller('DocumentsController', DocumentsController);

    DocumentsController.$inject = ['DocumentsService', '$window'];

    function DocumentsController(DocumentsService, $window) {
        var vm = this;
        vm.completeDocs = getCompletedDocs;
        vm.incompleteDocs = getIncompleteDocs;
        vm.view = viewDoc;

        init();

        function init() {
            getCompletedDocs();
            getIncompleteDocs();
        }

        function viewDoc(url) {
            $window.open(url, '_blank');
        }

        function getCompletedDocs() {
            return DocumentsService.query(function(data) {
                vm.completeDocs = data;
            })
        }

        function getIncompleteDocs() {
            return DocumentsService.queryIncomplete(function(data) {
                vm.incompleteDocs = data;
            })
        }

    }
})();
