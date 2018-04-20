/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.trustAsHtml = trustAsHtml;
        vm.youtubeUrl = youtubeUrl;
        vm.getHeaderHtml = getHeaderHtml;
        vm.setElementWidth = setElementWidth;
        vm.sortWidget = sortWidget;

        function init(){
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise
                .success(function(widgets){
                    vm.widgets = widgets;
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function trustAsHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function youtubeUrl(url) {
            if(!url )
                return url;

            //var newUrl = url.replace("youtu.be/", "youtube.com/embed/");

            var parts = url.split('/');
            var id = parts[parts.length - 1];
            var newUrl = "https://www.youtube.com/embed/" + id;

            //console.log(newUrl);
            return $sce.trustAsResourceUrl(newUrl);
        }

        function trustAsResourceUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function setElementWidth(elementId, width) {
            var element = document.getElementById(elementId);
            element.style.width = width;
    }

    function getHeaderHtml(widget) {
        if(!widget || !widget.text)
            return null;

        var size = 1;
        if(widget.size)
            size = widget.size;

        if( size > 6 )
            size = 6;

        var html = "<h" + size + ">" + widget.text + "</h" + size + ">";
        return $sce.trustAsHtml(html);
    }


        function sortWidget(start, end) {
            //console.log([start, end]);
            var promise = WidgetService.sortWidget(vm.pageId, start, end);
            promise
                .success(function(status){
                    init();
                })
                .error(function(msg){
                    console.log(msg);
                });

        }
    }
})();