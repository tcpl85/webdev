/**
 * Created by allday85 on 11/25/2016.
 */

module.exports = function(){
    var mongoose = require("mongoose");
    var Pageschema = mongoose.Schema({
        _website: {type: mongoose.Schema.Types.ObjectId, ref: "WebsiteModel"},
        name: String,
        title: String,
        description: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'WidgetModel'}],
        dateCreated: {type: Date, default: Date.now()},
    },{collection: "page"});

    return Pageschema;
}