/**
 * Created by tcpl8 on 11/17/2016.
 */
module.exports = function(){
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);
    var model = {};
    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        findAllPagesForWebsite: findAllPagesForWebsite,
        setModel: setModel,
    };
    return api;

    function setModel(_model){
        model = _model;
    }

    function createWebsiteForUser(userId, website){
        //may need some validation
        return new Promise( function(resolve, reject) {
            model.userModel
                .findUserById(userId)
                .then(
                    function(user) {
                        website._user = user._id;
                        WebsiteModel
                            .create(website)
                            .then(
                                function(newWebsite) {
                                    user.websites.push(newWebsite);
                                    user.save();
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


    function findAllWebsitesForUser(userId){
        return model.userModel.findAllWebsitesForUser(userId);
    }

    function findWebsiteById(websiteId){
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website){
        return WebsiteModel
            .update(
                {
                    _id: websiteId
                },
                {
                    name: website.name,
                    description: website.description,
                }
            )

    }

    function deleteWebsite(websiteId){
        return new Promise( function(resolve, reject) {
            WebsiteModel
                .findById(websiteId)
                .then(
                    function (website) {
                        model.userModel
                            .findUserById(website._user)
                            .then(
                                function(user){
                                    for(var i = 0; i < user.websites.length; ++i){
                                        if(website._id.equals(user.websites[i])){
                                            user.websites.splice(i, 1);
                                            user.save();
                                            break;
                                        }
                                    }

                                    var pages = website.pages;
                                    if(0 === pages.length){
                                        WebsiteModel
                                            .remove({
                                                _id: websiteId
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
                                        for (var j = 0; j < pages.length; ++j) {
                                            model.pageModel
                                                .deletePage(pages[j])
                                                .then(
                                                    function(status){
                                                        if(++count === pages.length) {
                                                            WebsiteModel
                                                                .remove({
                                                                    _id: websiteId
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

    function findAllPagesForWebsite(websiteId){
        return WebsiteModel
            .findById(websiteId)
            .populate("pages", "name")
            .exec();

        //
        //.populate("websites")
    }
}