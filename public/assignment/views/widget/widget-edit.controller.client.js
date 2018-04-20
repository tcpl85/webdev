/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("EditWidgetController", EditWidgetController);

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];
        vm.widgetId = $routeParams["wgid"];

        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        vm.goBackToWidgetList = goBackToWidgetList;
        vm.getFilenamePrefix = getFilenamePrefix;

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise
                .success(function(widgets){
                    vm.widgets = widgets;
                })
                .error(function(msg){
                    console.log(msg);
                });

            var promise2 = WidgetService.findWidgetById(vm.widgetId);
            promise2
                .success(function(widget){
                    vm.widget = widget;
                    vm.type = widget.type;

                    vm.isNewWidget = false;
                    if( false === WidgetService.checkRequiredFields(vm.widget))
                        vm.isNewWidget =true;
                })
                .error(function(msg){
                    console.log(msg);
                });
        }
        init();

        function updateWidget(widget) {
            //if( false === WidgetService.checkRequiredFields(widget))
            //    return;

            var promise = WidgetService.updateWidget(vm.widgetId, widget);
            promise
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
                .error(function(msg){
                    console.log(msg);
                });
        }

        function deleteWidget() {
            var promise = WidgetService.deleteWidget(vm.widgetId);
            promise
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
                .error(function(msg){
                    console.log(msg);
                });
        }

        function goBackToWidgetList() {
            /*
             if(true === vm.isNewWidget && false === WidgetService.checkRequiredFields(vm.widget))
             {
             deleteWidget();
             console.log("delete");
             }
             */

            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
        }



        function getFilenamePrefix() {
            //console.log(WidgetService.getFilenamePrefix(vm.widget.type));
            return WidgetService.getFilenamePrefix(vm.widget.type);
        }
    }
})();