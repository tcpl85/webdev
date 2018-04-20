/**
 * Created by allday85 on 11/6/2016.
 */
(function(){
    angular
        .module("jgaDirectives", [])
        .directive("jgaSortable", jgaSortable); // jga-sortable

    function jgaSortable() {
        function linker(scope, element, attributes) {
            var start = -1;
            var end = -1;
            element
                .sortable({
                    start: function(event, ui) {
                        start = $(ui.item).index();
                    },
                    stop: function(event, ui){
                        end = $(ui.item).index();
                        scope.jgaSortableCallback({start: start, end: end});
                    }
                });
        }
        return {
            scope: {
                jgaSortableCallback: '&'
            },
            link: linker,
            restrict: 'ACE',

        }
    }

})();