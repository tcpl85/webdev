/**
 * Created by allday85 on 10/25/2016.
 */
module.exports = function(app, model) {

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    model.pageModel.setModel(model);

    function createPage(req, res) {
        var page = req.body;
        var websiteId =  req.params["websiteId"];

        model.pageModel
            .createPage(websiteId, page)
            .then(
                function(code) {
                    res.send(code);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params["websiteId"];
        model.pageModel
            .findAllPagesForWebsite(websiteId)
            .then(
                function(website) {
                    res.json(website.pages);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findPageById(req, res) {
        var pageId = req.params["pageId"];
        model.pageModel
            .findPageById(pageId)
            .then(
                function(page){
                    if(page){
                        res.send(page);
                    }else{
                        res.send('-1');
                    }

                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updatePage(req, res) {
        var page = req.body;
        var pageId = req.params["pageId"];

        model.pageModel
            .updatePage(pageId, page)
            .then(
                function(status){
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deletePage(req, res) {
        var pageId = req.params["pageId"];

        model.pageModel
            .deletePage(pageId)
            .then(
                function(status){
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }
};