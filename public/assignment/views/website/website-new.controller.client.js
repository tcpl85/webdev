/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController", NewWebsiteController);

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.createWebsite = createWebsite;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise
                .success(function(websites){
                    vm.websites = websites;
                })
                .error(function(msg){
                    console.log(msg);
                });

        }
        init();

        function createWebsite(website) {
            if( undefined !== website && undefined !== website.name) {
                var promise = WebsiteService.createWebsite(vm.userId, website);
                promise
                    .success (function(website){
                        if('1' === website) {
                            $location.url("/user/" + vm.userId + "/website");
                        }else{
                            vm.error = "Failed to create the new website";
                        }
                    })
                    .error(function(msg){
                        console.log(msg);
                    });
            }
        }
    }
})();