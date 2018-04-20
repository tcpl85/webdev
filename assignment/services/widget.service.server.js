/**
 * Created by allday85 on 10/25/2016.
 */
module.exports = function(app, model) {

    var multer = require('multer'); // npm install multer --save
    var mime = require('mime'); // npm install mime --save

    //var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/assignment/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });

    var upload = multer({ storage: storage });

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.put("/api/page/:pageId/widget", sortWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);

    model.widgetModel.setModel(model);

    function createWidget(req, res){
        var widget = req.body;
        var pageId =  req.params["pageId"];

        model.widgetModel
            .createWidget(pageId, widget)
            .then(
                function(widget) {
                    res.send(widget);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllWidgetsForPage(req, res){
        var pageId = req.params["pageId"];
        model.widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function(page) {
                    res.json(page.widgets);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findWidgetById(req, res){
        var widgetId = req.params["widgetId"];
        model.widgetModel
            .findWidgetById(widgetId)
            .then(
                function(widget){
                    if(widget){
                        res.send(widget);
                    }else{
                        res.send('-1');
                    }

                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateWidget(req, res){
        var widget = req.body;
        var widgetId = req.params["widgetId"];

        model.widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function(status){
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteWidget(req, res){
        var widgetId = req.params["widgetId"];
        model.widgetModel
            .deleteWidget(widgetId)
            .then(
                function(status){
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }


    function sortWidget(req, res) {
        var pageId = req.params["pageId"];
        var start = req.query.initial;
        var end = req.query.final;

        model.widgetModel
            .reorderWidget(pageId, start, end)
            .then(
                function(code){
                    res.send(code);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function uploadImage(req, res) {
        var widget        = JSON.parse(req.body.widget);
        var pageId        = req.body.pageId;
        var websiteId        = req.body.websiteId;
        var userId        = req.body.userId;
        var myFile        = req.file;
        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var url = "/assignment/uploads/" + filename;
        widget.url = url;

        model.widgetModel
            .updateWidget(widget._id, widget)
            .then(
                function(status){
                    res.redirect('../assignment/index.html#/user/'+userId+'/website/'+websiteId+'/page/'+pageId+'/widget/');
                    //res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }
};