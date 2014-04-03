var mongoose = require('mongoose');
var request = require('request');
var User = mongoose.model('User');
var Campaign = mongoose.model('Campaign');
var Payment = mongoose.model('Payment');
var balanced = require('balanced-official');
var Q = require('q');
// change this all to bluebird

balanced.configure('ak-test-1P4LCuAfcv3isFlyX9mxNXvz6bI1XNril');

exports.signin = function(req, res){
  res.render('signin');
};

exports.authCallback = function(req, res) {
  // create the balanced customer here
  var customer = balanced.marketplace.customers.create({
    "name": req.user.displayName,
    "email": req.user.email
  }).then(function(data){
    User.findOne({_id: req.user._id}, function(err, user){
      user.balancedId = data.toJSON().id;
      user.save();
      res.redirect('/');
    });
  });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
  res.render('signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.addReputation = function(req, res){
  User.findOne({_id: req.body.id}, function(err, user){
    user.reputation += req.body.reputation;
    // want to add the total reputation of the user who is giving reputation
    // this will make it more fun lol
    user.save(function(err){
      res.jsonp(user);
    })
  })
}

exports.update = function(req, res){
  User.findOne({_id: req.body._id}, function(err, user){
    console.log(req.body.balancedToken);
    user.balancedToken = req.body.balancedToken;
    user.save(function(err, user){
      balanced.get('/cards/'+user.balancedToken).associate_to_customer('/customers/'+user.balancedId)
      .then(function(){
        res.jsonp(user);
      })
    })
  })
}

exports.showAll = function(req, res){
  User.find(function(err, user){
    user.populate('payments').populate('campaigns').exec(function(err, users){
      res.json({users: users});
    })
  })
}

var addPayments = function(paymentArray){
  var deferred = Q.defer();
  var i = 0
  var total = 0;
  if(paymentArray.length < 1){
    deferred.resolve(0);
  }
  paymentArray.forEach(function(payment){
    total += payment.amount;
    i++
    if(paymentArray.length === i){
      deferred.resolve(total);
    }
  })
  return deferred.promise;
}


exports.showOne = function(req, res){
  console.log(req.params.userId);
  User.findOne({_id: req.params.userId}).populate('payments').populate('campaigns').exec(function(err, user){
    console.log("hello there")
    console.log(user.paymentsMade);
    addPayments(user.paymentsMade)
    .then(function(total){
      user.totalpm = total;
      var deferred = Q.defer();
      console.log(user.paymentsReceived);
      addPayments(user.paymentsReceived).then(function(data){
        deferred.resolve(data);
      })
      return deferred.promise;
    })
    .then(function(total){
      user.totalpr = total;
      user.save()
      console.log("hello there")
      Campaign.find({merchants: user._id}).populate('merchants').populate('marketplace').exec(function(err, campaigns){
        console.log(campaigns);
        user.campaigns = campaigns;
        res.json(user);
      })
    })

  });
};

// here we also need to access the campaign so that
// we can update and add the new customer to the
// list of campaigns



// take out the User.findOne

