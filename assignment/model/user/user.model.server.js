/**
 * Created by tcpl8 on 11/14/2016.
 */
module.exports = function(){
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        updateUser: updateUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        deleteUser: deleteUser,
        setModel: setModel,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId

    };
    return api;

    function setModel(_model){
        model = _model;
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function createUser(user){
        //may need some validation
        return UserModel.create(user);
    }

    function findUserById(userId){
        return UserModel.findById(userId);
    }

    function findUserByCredentials(username, password){
        return UserModel
            .findOne(
                {
                    username: username,
                    password: password
                }
            );
    }

    function findUserByUsername(username){
        return UserModel
            .findOne(
                {
                    username: username,
                }
            );
    }


    function updateUser(userId, user){
        return UserModel
            .update(
                {
                    _id: userId
                },
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                }
            )
    }

    function deleteUser(userId){
        return new Promise( function(resolve, reject) {
            UserModel
                .findById(userId)
                .then(
                    function (user) {
                        var websites = user.websites;
                        if(0 === websites.length){
                            UserModel
                                .remove({
                                    _id: userId
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
                            for (var i = 0; i < websites.length; ++i) {
                                model.websiteModel
                                    .deleteWebsite(websites[i])
                                    .then(
                                        function(status){
                                            if(++count === websites.length){
                                                UserModel
                                                    .remove({
                                                        _id: userId
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
                    function (error) {
                        reject(error);
                    }
                )
        });
    }

    function findAllWebsitesForUser(userId){
        return UserModel
            .findById(userId)
            .populate("websites", "name")
            .exec();

        //
        //.populate("websites")
    }

}