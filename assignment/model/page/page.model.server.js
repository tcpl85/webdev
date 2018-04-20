/**
 * Created by tcpl8 on 11/17/2016.
 */
module.exports = function(){
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);
    var model = {};
    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        findAllWidgetsForPage: findAllWidgetsForPage,
        setModel: setModel,
    };
    return api;

    function setModel(_model){
        model = _model;
    }

    function createPage(websiteId, page){
        //may need some validation
        return new Promise( function(resolve, reject) {
            model.websiteModel
                .findWebsiteById(websiteId)
                .then(
                    function(website) {
                        page._website = website._id;
                        PageModel
                            .create(page)
                            .then(
                                function(newPage) {
                                    website.pages.push(newPage);
                                    website.save();
                                    resolve('1');
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

    function findAllPagesForWebsite(websiteId){
        return model.websiteModel.findAllPagesForWebsite(websiteId);
    }

    function findPageById(pageId){
        return PageModel.findById(pageId);
    }

    function updatePage(pageId, page){
        return PageModel
            .update(
                {
                    _id: pageId
                },
                {
                    name: page.name,
                    title: page.title,
                    description: page.description,
                }
            )

    }

    function deletePage(pageId){
        return new Promise( function(resolve, reject) {
            PageModel
                .findById(pageId)
                .then(
                    function (page) {
                        model.websiteModel
                            .findWebsiteById(page._website)
                            .then(
                                function(website){
                                    for(var i = 0; i < website.pages.length; ++i){
                                        if(page._id.equals(website.pages[i])){
                                            website.pages.splice(i, 1);
                                            website.save();
                                            break;
                                        }
                                    }

                                    var widgets = page.widgets;
                                    if(0 === widgets.length ){
                                        PageModel
                                            .remove({
                                                _id: pageId
                                            })
                                            .then(
                                                function (status) {
                                                    resolve(status);
                                                },
                                                function (error) {
                                                    reject(error);
                                                }
                                            )
                                    }else{
                                        var count = 0;
                                        for (var j = 0; j < widgets.length; ++j) {
                                            model.widgetModel
                                                .deleteWidget(widgets[j])
                                                .then(
                                                    function(status){
                                                        if(++count === widgets.length){
                                                            PageModel
                                                                .remove({
                                                                    _id: pageId
                                                                })
                                                                .then(
                                                                    function (status) {
                                                                        resolve(status);
                                                                    },
                                                                    function (error) {
                                                                        reject(error);
                                                                    }
                                                                )
                                                        }
                                                    },
                                                    function(error){
                                                        reject(error);
                                                    }
                                                );
                                        }
                                    }




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

    function findAllWidgetsForPage(pageId){
        return PageModel
            .findById(pageId)
            .populate("widgets")
            .exec();

        //
        //.populate("websites")
    }
}