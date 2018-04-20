/**
 * Created by allday85 on 11/13/2016.
 */
// show dbs
// use test
// show collections
// db.messages.find()
// db.messages.insert()
// db.messages.remove()
// db.messages.create()
// db.messages.drop()

module.exports = function()
{
    var mongoose = require("mongoose");
    var connectionString = 'mongodb://127.0.0.1:27017/wam-fall-2016';
    //var connectionString = 'mongodb://jongilpark:webdev@ds033076.mlab.com:33076/webdev-jongil-park';
    if(process.env.MONGODBLAB_USERNAME) {
        connectionString = 'mongodb://' +
            process.env.MONGODBLAB_USERNAME + ':' +
            process.env.MONGODBLAB_PASSWORD + '@' +
            process.env.MONGODBLAB_HOST + ':' +
            process.env.MONGODBLAB_PORT + '/' +
            process.env.MONGODBLAB_PATH;
    }
    mongoose.connect(connectionString);

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };
    return model;
};