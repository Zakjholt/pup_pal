var User = require('./models/user');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/main',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
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
                'pupName': req.body.pupName
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
        }, function() {
            res.sendStatus(204);
        });
    });

    //Handle trick posts
    app.post('/tricks/:trick', function(req, res) {
        var trick = req.params.trick;
        var field = 'tricks.' + trick;
        User.findOneAndUpdate({
                '_id': req.user._id
            }, {
                $inc: {
                    [field]: 1
                }
            },
            function() {
                res.sendStatus(204);
            });
    });

    app.get('/main', isLoggedIn, function(req, res) {
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
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
