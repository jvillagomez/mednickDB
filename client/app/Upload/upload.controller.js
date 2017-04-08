(function() {

    angular.module('Upload').controller('UploadController', UploadController);

    UploadController.$inject = [
        'DocumentsService',
        '$mdToast',
        '$state',
        '$mdDialog'
    ];

    function UploadController(DocumentService, $mdToast, $state, $mdDialog) {
        var vm = this;
        vm.form = {};
        vm.files = null;
        vm.model = {
            "study": "",
            "subject": "",
            "visit": "",
            "session": "",
            "filetype": "",
            "docfile": null,
            "complete": false,
            "notes": "",
            "name": []
            /*"dateUploaded": "PLACEHOLDER",
            "url": "PLACEHOLDER"*/
            //"parse": false,

        }

        vm.fileTypes = [{
            ID: "1",
            Name: "Sleep Scoring"
        }, {
            ID: "2",
            Name: "PSG"
        }, {
            ID: "3",
            Name: "Sleep Diary"
        }]

        vm.cancel = function(){ $state.go("^.documents") }
        vm.submit = submit;

        function submit(ev) {
            vm.model.name = [];
            vm.model.docfile = vm.files.map(function(obj) {
                vm.model.name.push(obj.lfFileName)
                return obj.lfFile;
            })
            var dialogTitle = "";
            var dialogContent = "";
            var okText = "";
            if (vm.model.study && vm.model.subject && vm.model.visit && vm.model.session && vm.model.filetype.length > 0) {
                vm.model.complete = true;
                dialogTitle = "Submit information";
                dialogContent = "Form will be submitted with the information provided";
                okText = "Submit";

            } else {
                vm.model.complete = false;
                dialogTitle = "Not all fields on the form are filled out";
                dialogContent = "Submit as 'incomplete'?";
                okText = "Submit";
            }
            var confirm = $mdDialog.confirm()
                .title(dialogTitle)
                .textContent(dialogContent)
                .ariaLabel('Upload File')
                .targetEvent(ev)
                .ok(okText)
                .cancel('Cancel');

            $mdDialog.show(confirm)
                .then(function() {
                    DocumentService.save(vm.model,
                        function success(data) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('File Uploaded successfully')
                                .hideDelay(5000)
                            );
                            $state.go('private.layout.documents');
                        },
                        function error(err) {
                            var status = (err.status > 0) ? err.status : "";
                            var statusText = err.statusText || "";
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('Error occurred: ' + status + " " + statusText)
                                .hideDelay(5000)
                            );
                        }
                    )
                }, function() {
                    //cancel
                });
        }
    }

})();
