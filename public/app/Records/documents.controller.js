(function() {
    'use strict';

    angular
        .module('Documents')
        .controller('DocumentsController', DocumentsController);

    DocumentsController.$inject = ['DocumentsService', '$window'];

    function DocumentsController(DocumentsService, $window) {
        var vm = this;
        vm.completeDocs = [];
        vm.incompleteDocs = [];
        vm.view = viewDoc;

        init();

        function init() {
            getCompleteDocs();
            getIncompleteDocs();
        }

        function viewDoc(url) {
            $window.open(url, '_blank');
        }

        function getCompleteDocs() {
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
