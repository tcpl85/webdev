/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("EditPageController", EditPageController);

    function EditPageController($routeParams,$location, PageService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            var promise = PageService.findPagesByWebsiteId(vm.websiteId);
            promise
                .success(function(pages){
                    vm.pages = pages;
                })
                .error(function(msg){
                    console.log(msg);
                });

            var promise2 = PageService.findPageById(vm.pageId);
            promise2
                .success(function(page){
                    vm.page = page;
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function updatePage(page)
        {
            if(undefined !== page && undefined !== page.name)
            {
                var promise = PageService.updatePage(vm.pageId, page);
                promise
                    .success(function(page){
                        if('-1' !== page) {
                            vm.page = page;
                        }
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    })
                    .error(function(msg){
                        console.log(msg);
                    });
            }
        }

        function deletePage()
        {
            var promise = PageService.deletePage(vm.pageId);
            promise
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
    }

})();