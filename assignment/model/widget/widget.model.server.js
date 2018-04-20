/**
 * Created by tcpl8 on 11/17/2016.
 */
module.exports = function(){
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);
    var model = {};

    var widgetFilter = {
        "HEADING": ["name", "text", "size"],
        "IMAGE": ["name", "text", "url", "width"],
        "YOUTUBE": ["name", "text", "url", "width"],
        "HTML": ["name", "text" ],
        "TEXT": ["name", "text", "rows", "placeholder", "formatted"]
    }

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget,
        setModel: setModel,
    };
    return api;

    function setModel(_model){
        model = _model;
    }

    function createWidget(pageId, widget){
        //may need some validation
        return new Promise( function(resolve, reject) {
            model.pageModel
                .findPageById(pageId)
                .then(
                    function(page) {
                        widget._page = page._id;
                        WidgetModel
                            .create(widget)
                            .then(
                                function(newWidget) {
                                    page.widgets.push(newWidget);
                                    page.save();
                                    resolve(newWidget);
                                },
                                function(error){
                                    reject(error);
                                }
                            )
                    },
                    function(error){
                        reject(error);
                    }
                )
        });
    }

    function findAllWidgetsForPage(pageId){
        return model.pageModel.findAllWidgetsForPage(pageId);
    }

    function findWidgetById(widgetId){
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget){
        var filter = getFilterByType(widget);
        return WidgetModel
            .update(
                {
                    _id: widgetId
                },
                filter
            )

    }

    function deleteWidget(widgetId){
        return new Promise( function(resolve, reject) {
            WidgetModel
                .findById(widgetId)
                .then(
                    function (widget) {
                        model.pageModel
                            .findPageById(widget._page)
                            .then(
                                function(page){
                                    for(var i = 0; i < page.widgets.length; ++i){
                                        if(widget._id.equals(page.widgets[i])){
                                            page.widgets.splice(i, 1);
                                            page.save();
                                            break;
                                        }
                                    }

                                    WidgetModel
                                        .remove({
                                            _id: widgetId
                                        })
                                        .then(
                                            function (status) {
                                                resolve(status);
                                            },
                                            function (error) {
                                                reject(error);
                                            }
                                        )

                                },
                                function(error){
                                    reject(error);
                                }
                            );
                    },
                    function (error) {
                        reject(error);
                    }
                )
        });
    }

    function reorderWidget(pageId, start, end){
        return new Promise( function(resolve, reject) {
            model.pageModel
                .findPageById(pageId)
                .then(
                    function(page){
                        var widget = page.widgets.splice(start,1)[0];
                        page.save();
                        page.widgets.splice(end, 0, widget);
                        page.save();
                        resolve('1');
                    },
                    function(error){
                        reject(error);
                    }
                )
        });

    }

    function getFilterByType(widget){
        var filter = {};
        var fields = widgetFilter[widget.type];

        for(var r in fields) {
            var field = fields[r];
            filter[field] = widget[field];
        }

        return filter;
    }

}