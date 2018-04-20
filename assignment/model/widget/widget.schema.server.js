/**
 * Created by allday85 on 11/25/2016.
 */

module.exports = function(){
    var mongoose = require("mongoose");
    var Widgetschema = mongoose.Schema({
        _page: {type: mongoose.Schema.Types.ObjectId, ref: "PageModel"},
        type: {type: String, enum: ['HEADING', 'IMAGE', 'YOUTUBE', 'HTML', 'TEXT']},
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: String,
        height: String,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {type: Date, default: Date.now()},
    },{collection: "widget"});

    return Widgetschema;
}