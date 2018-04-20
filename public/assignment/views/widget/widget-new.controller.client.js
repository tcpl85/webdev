/**
 * Created by allday85 on 10/5/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("NewWidgetController", NewWidgetController);

    function NewWidgetController($routeParams, $location, WidgetService)
    {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.websiteId = $routeParams["wid"];
        vm.pageId = $routeParams["pid"];

        vm.createWidget = createWidget;
        vm.getWidgetLinkString = getWidgetLinkString;

        function init() {
            vm.widgetTypes = WidgetService.getWidgetTypes();
            vm.widgetTypeLinks = WidgetService.getWidgetTypeLinks();
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

        function createWidget(widgetType) {
            var widget = {"type": widgetType};
            var allDefaultValues = WidgetService.getDefaultValues();
            var defaultValues = allDefaultValues[widgetType];

            if( undefined !== defaultValues) {
                for (var key in defaultValues) {
                    widget[key] = defaultValues[key];
                }
            }

            var promise = WidgetService.createWidget(vm.pageId, widget);
            promise
                .success (function(widget){
                    if(widget) {
                        $location.url("/user/" + vm.userId +"/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widget._id);
                    }else{
                        vm.error = "Failed to create the new widget"
                    }
                })
                .error(function(msg){
                    console.log(msg);
                });
        }


        function getWidgetLinkString(){
            return WidgetService.getWidgetLinkString(vm.widget.type);
        }
    }
})();