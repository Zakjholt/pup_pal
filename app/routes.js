var User = require('./models/user');
var twilio = require('twilio');
var client = twilio('ACb98f0967f2cc6b856e2ffd3c0e79be8e', '2a6c482f377f1f0861164bf730c880b0');
var moment = require('moment');
var cron = require('node-cron');

//Check to send twilio messages
var cron = require('node-cron');


module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', {
            user: req.user
        });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage'),
            user: req.user
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/main',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage'),
            user: req.user
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/onboard', // redirect to onboarding
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/onboard', isLoggedIn, function(req, res) {
        res.render('onboard.ejs', {
            user: req.user
        });
    });

    //Process the onboarding user info (Your name and dog's name)
    app.post('/onboard', function(req, res) {
        console.log(req.body);
        console.log(req.user);
        User.findOneAndUpdate({
            '_id': req.user._id
        }, {
            $set: {
                'palName': req.body.palName,
                'pupName': req.body.pupName,
                'cellNumber': req.body.cellNumber
            }
        }, function() {
            res.sendStatus(204);
        });
    });

    //Handling meal time posts
    app.post('/meal', function(req, res) {
        console.log(req.body);
        User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $currentDate: {
                    'mealTime': true
                },
            },
            function(err, user) {
                if (err) throw err;
                //Add an && some value equals true to give users the option to not receive texts
                if (user.cellNumber) {
                    var outsideNote = cron.schedule('*/20 * * * *', function() {
                        client.sendMessage({
                            to: user.cellNumber,
                            from: '12402057908',
                            body: 'It\'s time to take ' + user.pupName + ' outside!'
                        });
                        console.log('Text message reminder sent!');
                        outsideNote.stop();
                    });
                    outsideNote.start();
                }
                res.sendStatus(204);
            });

    });

    //Handle trick posts
    app.post('/tricks/:trick', function(req, res) {

        var trick = req.params.trick;
        var field = 'tricks.' + trick;
        User.findOneAndUpdate({
                _id: req.user._id
            }, {
                $inc: {
                    [field]: 1
                },
                $currentDate: {
                    trickTime: true
                }
            },
            function() {
                res.sendStatus(204);
            });
    });

    //Handle the delete trick requests
    app.delete('/tricks/:trick', function(req, res) {
        var trick = req.params.trick;
        var id = req.user._id;
        User.findOne({
            '_id': id
        }, function(err, user) {
            if (err) return handleError(err);
            console.log(user.tricks[trick]);
            delete user.tricks[trick];
            console.log(user.tricks);
            user.markModified('tricks');
            user.save(function(err) {
                console.log('Save function ran');
                if (err)
                    handleError(res, err);
                res.sendStatus(200);

            });
        });
    });

    app.get('/main', isLoggedIn, function(req, res) {
        var id = req.user._id;

        ///Checks to see if it's the day after the last trick time;
        User.findById(id, function(err, user) {
            if (err) return handleError(err);
            var now = moment();
            // Reset Trick Counters Daily
            if (user.trickTime) {
                if (moment(now).isAfter(user.trickTime, 'day')) {
                    console.log("Tricks reset!");
                    for (var i in user.tricks) {
                        if (user.tricksRecord && user.tricks.i > user.tricksRecord.i) {
                            user.tricksRecord.i = user.tricks.i;
                        } else if (!(user.tricksRecord)) {
                            user.tricksRecord = {};
                            user.tricksRecord.i = user.tricks.i;
                        }
                        user.tricks.i = 0;
                    }
                }
            }
            //Reset Meal Time Daily
            if (user.mealTime) {
                if (moment(now).isAfter(user.mealTime, 'day')) {
                    console.log("Mealtime Reset!");
                    user.mealTime = undefined;
                }
            }
            //Updates the user with the changes
            user.markModified('tricks');
            user.save(function(err) {
                if (err) return handleError(err);
            });
        });


        //Automatically sends to onboarding if data is missing
        if (!(req.user.pupName || req.user.palName)) {
            res.redirect('/onboard');
        }
        res.render('main.ejs', {
            user: req.user
        });
    });

    app.get('/settings', isLoggedIn, function(req, res) {
        res.render('settings', {
            user: req.user
        });
    });


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/main',
            failureRedirect: '/'
        }));
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
