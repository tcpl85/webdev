/**
 * Created by allday85 on 10/25/2016.
 */
module.exports = function(app, model) {
    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(new LocalStrategy(localStrategy));

    model.userModel.setModel(model);

    app.post('/api/login', passport.authenticate('local'), login);
    app.get ('/api/loggedin', loggedin);
    app.post('/api/logout', logout);
    app.post ('/api/register', register);
    app.post("/api/user", createUser);
    app.get('/api/user', findUser);
   //app.get("/api/user?username=username", findUserByUsername);
   //app.get("/api/user?username=username&password=password", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", loggedInAndSelf,  updateUser);
    app.delete("/api/user/:userId", loggedInAndSelf, deleteUser);

    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    }

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));



    function facebookStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.email;
                        //var emailParts = email.split("@");
                        var username = profile.provider + '_' + profile.displayName;
                        if(email){
                            var emailParts = email.split("@");
                            username = emailParts[0];
                        }
                        username = username.toLowerCase();
                        var displayName = profile.displayName;
                        var nameParts = displayName.split(' ');

                        var givenName = profile.name.givenName;
                        var familyName = profile.name.familyName;

                        if(!givenName && displayName)
                            givenName = nameParts[0];

                        if(!familyName && displayName && nameParts && nameParts.length >= 2)
                            familyName = nameParts[1];

                        var newGoogleUser = {
                            username:  username,
                            firstName: givenName,
                            lastName:  familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done){
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }


    function login(req, res){
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function loggedInAndSelf(req, res, next){
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;
        var self = userId == req.user._id;
        if(self && loggedIn){
            next();
        }else{
            res.sendStatus(400).send("You are not the same person");
        }
    }

    function register (req, res) {
        var user = req.body;
        model
            .userModel
            .findUserByUsername(user.username)
            .then(
                function(userObj) {
                    if(userObj) {
                        res.send('0');
                    }else{
                        user.password = bcrypt.hashSync(user.password);
                        return model.userModel.createUser(user)
                    }
                },
                function(error) {
                    res.sendStatus(400).send(error);
                }
            )
            .then(
                function(newUser){
                    if(newUser){
                        req.login(newUser, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(newUser);
                            }
                        });
                    }
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            );
    }


    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .findUserByUsername(user.username)
            .then(
                function(userObj) {
                    if(userObj) {
                        res.send('0');
                    }else{
                        model.userModel
                            .createUser(user)
                            .then(
                                function(newUser){
                                    res.send(newUser);
                                },
                                function(error){
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function(error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUser(req, res) {
        var params = req.params;
        var query = req.query;
        if(query.password && query.username) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
        }
        else{
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function(userObj) {
                    if(userObj) {
                        res.send(userObj);
                    }else{
                        res.send('-1');
                    }
                },
                function(error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if(user){
                        res.send(user[0]);
                    }else{
                        res.send('-1');
                    }
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserById(req, res) {
        var userId = req.params["userId"];
        model
            .userModel
            .findUserById(userId)
            .then(
                function(user){
                    if(user){
                        res.send(user);
                    }else{
                        res.send('-1');
                    }
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateUser(req, res) {
        var user = req.body;
        var userId = req.params["userId"];
        model
            .userModel
            .updateUser(userId, user)
            .then(
                function(status) {
                    res.sendStatus(200);
                },
                function(error){
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteUser(req, res) {
        var userId = req.params["userId"];
        model
            .userModel
            .deleteUser(userId)
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