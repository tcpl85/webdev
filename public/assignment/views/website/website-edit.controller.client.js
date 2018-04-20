/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", EditWebsiteController);

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        //vm.iserId = $routeParams.uid;
        vm.websiteId = $routeParams["wid"];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise
                .success(function(websites){
                    vm.websites = websites;
                })
                .error(function(msg){
                    console.log(msg);
                });

            var promise2 = WebsiteService.findWebsiteById(vm.websiteId);
            promise2
                .success(function(website){
                    if( '-1' !== website){
                        vm.website = website;
                    }
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function updateWebsite(website) {
            if( undefined !== website && undefined !== website.name) {
                var promise = WebsiteService.updateWebsite(vm.websiteId, website);
                promise
                    .success(function(status){
                        $location.url("/user/" + vm.userId + "/website");
                    })
                    .error(function(msg){
                        console.log(msg);
                    });
            }
        }

        function deleteWebsite() {
            var promise = WebsiteService.deleteWebsite(vm.websiteId);
            promise
                .success(function(status){
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
    }
})();