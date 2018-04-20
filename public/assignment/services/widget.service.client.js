/**
 * Created by allday85 on 10/4/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {
        var widgetTypes = [ "HEADING",  "IMAGE", "YOUTUBE", "HTML", "TEXT"];

        var widgetTypeLinks = [
            {"type": "HEADING", "link": "HEADING"},
            {"type": "IMAGE", "link": "IMAGE"},
            {"type": "YOUTUBE", "link": "YOUTUBE"},
            {"type": "HTML", "link": "HTML"},
            {"type": "TEXT", "link": "TEXT Input"},
        ];

        var requiredFields = {
            "HEADING": ["name", "text"],
            "HTML": ["name", "text"],
            "IMAGE": ["name","url", "width"],
            "YOUTUBE": ["name","url", "width"],
            "TEXT": ["name", "rows"]
        };

        var defaultValues = {
            "HEADING": {"size": 1 },
            "IMAGE": {"width": "100%"},
            "YOUTUBE": {"width": "100%"},
            "TEXT": {"rows": 1}
        };

        var filenamePrefixes = {
            "HEADING": "heading",
            "HTML": "html",
            "IMAGE": "image",
            "YOUTUBE": "youtube",
            "TEXT": "text"
        };

        var api = {
            "createWidget"   : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget,
            "getWidgetTypes" : getWidgetTypes,
            "getDefaultValues": getDefaultValues,
            "checkRequiredFields": checkRequiredFields,
            "getFilenamePrefix": getFilenamePrefix,
            "getWidgetLinkString": getWidgetLinkString,
            "getWidgetTypeLinks": getWidgetTypeLinks,
            "sortWidget": sortWidget
        };

        return api;

        function createWidget(pageId, widget) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }

        function getWidgetTypes() {
            return widgetTypes;
        }

        function getRequiredFields() {
            return requiredFields;
        }

        function getDefaultValues() {
            return defaultValues;
        }

        function checkRequiredFields(widget) {
            var fields = requiredFields[widget.type];

            for(var r in fields) {
                if(undefined === widget[fields[r]])
                    return false;
            }

            return true;
        }

        function getFilenamePrefix(widgetType) {
            return filenamePrefixes[widgetType];
        }

        function sortWidget(pageId, start, end) {
            var url = "/api/page/" + pageId + "/widget?initial=index1&final=index2";
            url = url
                .replace("index1", start)
                .replace("index2", end);
            return $http.put(url);
        }

        function getWidgetLinkString(widgetType){
            return widgetLinks[widgetType];
        }

        function getWidgetTypeLinks(){
            return widgetTypeLinks;
        }


    }
})();