var async = require('async');
var request = require('request');
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize the user object based on a pre-serialized token
// which is the user id
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, function(err, user) {
    done(err, user);
  });
});
// this will attach user to request (req.user);

passport.use(new GitHubStrategy({
    clientID: '4134b73c4eee94f0360b',
    clientSecret: '11976238d07928ab0677af4522b185cb89b14b3c',
    callbackURL: "http://192.168.1.178:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ githubId: profile.id }, function (err, user) {
      if(err) return err;
      if(!user){
        var u = new User({
          displayName: profile.displayName,
          email: profile._json.email,
          githubId: profile.id,
          github: profile._json,
          githubUrl: profile._json.html_url,
          githubAccessToken: accessToken,
          username: profile._json.login
          // this should be the username
          // http://developer.github.com/v3/users/#get-the-authenticated-user
          // check this website to confirm if it doesn't work
        });
        u.save(function(err){
          return done(err, u);
        });
      } else{
        return done(err, user);
      }
    });
  }
));

module.exports = function(app) {
  //Home route
  var campaign = require('../app/controllers/issues');
  var users = require('../app/controllers/users');
  var payments = require('../app/controllers/payments');
  var index = require('../app/controllers/index');
  app.get('/', index.render);

  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);

  app.get('/campaign', campaign.showAll)
  app.get('/campaign/:campaignId', campaign.showOne)
  app.post('/searchbar', campaign.query);

  app.post('/campaign', campaign.createCampaign);

  app.get('/auth/github',
    passport.authenticate('github'),
    users.signin);

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    users.authCallback);

  app.get('/searchbar', campaign.showTemporaryIssues)

  app.put('/user/:userId', users.update);
  app.get('/user/:userId', users.showOne);
  app.post('/campaign/payment', campaign.payment);
  // app.post('/users', users.addCustomer);
  // app.post('/campaign/payment', campaign.addPayment);
};



