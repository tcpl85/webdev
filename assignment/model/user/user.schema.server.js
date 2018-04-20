/**
 * Created by tcpl8 on 11/14/2016.
 */
module.exports = function(){
    var mongoose = require("mongoose");
    //var WebsiteSchema = require("../website/website.schema.server");
    var UserSchema = mongoose.Schema({
        username: {type:String, required: true},
        password: {type:String, required: false},
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: {type: Date, default: Date.now()},
        facebook: {
            id:    String,
            token: String
        },
        google: {
            id:    String,
            token: String
        },
        //webists: [WebsiteSchema],
        //websites: [{}],
    },{collection: "user"});

    /*
    var user = {
        username: 'alice',
        websites: [
            {_id: "123", name: 'facebook.com'},
            {_id: "234", name: 'twitter.com'}
        ]
    }
    */

    return UserSchema;
}