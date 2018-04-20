/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("NewPageController", NewPageController);

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.createPage = createPage;

        function init() {
            var promise = PageService.findPagesByWebsiteId(vm.websiteId);
            promise
                .success(function(pages){
                    vm.pages = pages;
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function createPage(page) {
            if(undefined !== page && undefined !== page.name) {
                var promise = PageService.createPage(vm.websiteId, page);
                promise
                    .success (function(page){
                        if('1' === page) {
                            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                        }else{
                            vm.error = "Failed to create the new page"
                        }
                    })
                    .error(function(msg){
                        console.log(msg);
                    });

            }
        }
    }
})();