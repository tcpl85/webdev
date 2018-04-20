/**
 * Created by allday85 on 10/25/2016.
 */
module.exports = function(app, model) {

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    model.websiteModel.setModel(model);

    function createWebsite(req, res) {
        var website = req.body;
        var userId = req.params["userId"];

        model.websiteModel.createWebsiteForUser(userId, website)
            .then(
                function(code) {
                    res.send(code);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );

    }

    function findAllWebsitesForUser(req, res){
        var userId = req.params.userId
        model.websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function(user) {
                    res.json(user.websites);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }

            )

    }

    function findWebsiteById(req, res)
    {
        var websiteId = req.params["websiteId"];
        model.websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website){
                    if(website){
                        res.send(website);
                    }else{
                        res.send('-1');
                    }

                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateWebsite(req, res) {
        var website = req.body;
        var websiteId = req.params["websiteId"];

        model.websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function(status){
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteWebsite(req, res){
        var websiteId = req.params["websiteId"];

        model.websiteModel
            .deleteWebsite(websiteId)
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