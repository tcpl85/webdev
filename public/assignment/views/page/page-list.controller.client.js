/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController);

    function PageListController($routeParams, PageService)
    {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];

        function init(){
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
    }
})();