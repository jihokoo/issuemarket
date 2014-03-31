var request = require('request');
var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');
var User = mongoose.model('User');
var Payment = mongoose.model('Payment');
var balanced = require('balanced-official');
var nodemailer = require('nodemailer');
var Q = require('q');
var temporaryIssues = require('../models/temporaryIssues')['temporaryIssues'];
var _ = require('underscore');

balanced.configure('ak-test-1P4LCuAfcv3isFlyX9mxNXvz6bI1XNril');

var payoutAction = function(paymentObject, done){
  var paymentOptions = {
    "card_href": paymentObject.url,
    "uri": paymentObject.url+"debit",
    "payload": {
      "appears_on_statement_as": paymentObject.statement,
      "amount": paymentObject.amount
    }
    // create orders later
    // https://docs.balancedpayments.com/1.1/api/orders/#create-an-order
  };
  balanced.get(paymentObject.url+"credits").credit(paymentOptions).then(done)
};

var paymentAction = function(paymentObject, done){
  console.log("inside paymentaction")
  var paymentOptions = {
      "appears_on_statement_as": paymentObject.statement,
      "amount": parseInt(paymentObject.amount)
    // create orders later
    // https://docs.balancedpayments.com/1.1/api/orders/#create-an-order
  };
  balanced.get('/cards/'+paymentObject.balancedToken).debit(paymentOptions).then(function(debit){
    done(debit.toJSON());
  })
};
// https://docs.balancedpayments.com/1.1/api/debits/#create-a-card-debit
// https://docs.balancedpayments.com/1.1/api/credits/#create-a-credit

var sendEmail = function(mailingList, message){
  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Mandrill",
      auth: {
          user: "issuemarket@gmail.com",
          pass: "9qb6trzMhLC6sRYjeRgPCA"
      }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "sender_bot_@issuemarket.com", // sender address
      to: mailingList.join(", "), // list of receivers
      // subject: message.subject, // Subject line
      subject: "hello",
      // text: message.text, // plaintext body
      text: "text message",
      // html: message.html // html body
      html: "<p>html shit</p>"
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
}
// generic function for sending emails
// call this when new payment is added
// when payouts occur
// when campaign has tilted
// when developer submits his work
// developer should submit a pull request


var afterIterate = function(list, done){
  list.forEach(function(element){
    console.log(temporaryIssues);
    temporaryIssues.push(element);
  });
  done(temporaryIssues.list());
}



module.exports = {
  query: function(req, res){
    console.log(req.body);
    var language = 'language:'+req.body.language;
    var sortBy = '&sort='+req.body.sortBy+'&order=desc';
    var defaultOptions = '+type:issues+state:open';
    var githubBaseURL = 'https://api.github.com/search/issues?q='
    var url = githubBaseURL+language+defaultOptions+sortBy;
    request.get({url: url, headers: {"User-Agent": "jihokoo"}}, function(e, r, githubResponse){
      var githubResponse = JSON.parse(githubResponse);
      afterIterate(githubResponse.items, function(githubResponse){
        console.log(githubResponse);
        res.jsonp({items: githubResponse});
      });
    });
  },

  createCampaign: function(req, res){
    var c = new Campaign({
      title: req.body.title,
      description: req.body.description,
      merchants: req.body.merchants,
      status: "pending",
      issue: temporaryIssues.find({id: parseInt(req.body.issueId)})[0],
      escrowFund: 0,
      tiltThreshold: req.body.tiltThreshold
    });
    c.save(function(err, c){
      User.findOne({_id: req.body.merchants[0]}, function(err, user){
        user.campaigns.push(c._id);
        user.save(function(err){
          res.jsonp(c);
        })
      })
    })
  },

  payout: function(req, res){
    payoutAction(req.body, function(creditObject){
      Payment.findOne({_id: req.body.paymentId}, function(err, payment){
        payment.status = "complete";
        User.findOne({_id: req.body.userId}, function(err, user){
          user.paymentsReceived.push(payment._id);
          payment.save(function(err){
            if(err) return err;
            res.jsonp(payment);
          })
        })
      })
    })
  },
  // customer clicks payout
  // just think about one customer for now
  // when i click to pay, i should have all the parameters set up
  // parameters should be hard coded into the campaign box

  closeCampaign: function(req, res){
    Campaign.findOne({_id: req.body.campaignId}, function(err, campaign){
      campaign.status = "Success";
      // campaign.status = req.body.campaignStatus;// this is because campaigns
      // // will close not only when they are successful
      campaign.save(function(err){
        res.jsonp(campaign);
      })
    })
  },

  showTemporaryIssues: function(req, res){
    console.log(temporaryIssues.list());
    res.jsonp(temporaryIssues.list());
  },

  payment: function(req, res){
    console.log("user")
    User.findOne({_id: req.body.giver}, function(err, user){
      Campaign.findOne({_id: req.body.campaign}, function(err, campaign){
        // before i call paymentAction i need the payment object to hold
        // the user's balancedToken
        req.body.balancedToken = user.balancedToken;
        paymentAction(req.body, function(debitObject){
          var payment = new Payment({
            amount: parseInt(req.body.amount),
            giver: req.body.giver,
            taker: req.body.taker,
            campaign: campaign._id,
            contributor: user.displayName,
            balancedId: debitObject.id,
            created: debitObject.created_at,
            status: debitObject.status,
            type: 'debit'
          });
          if(campaign.marketplaces && campaign.marketplaces.indexOf(req.body.giver) === -1){
            campaign.marketplaces.push(user._id);
          } else if(!campaign.marketplace){
            campaign.marketplaces = [user._id];
          }
          campaign.marketplaces = [user._id];
          console.log(campaign.marketplaces);
          console.log("hey watup");
          user.paymentsMade = [payment._id];
          campaign.payments = [payment._id];
          campaign.escrowFund += payment.amount;
          user.save(function(err){
            campaign.save(function(err){
              payment.save(function(err){
                res.jsonp(campaign);
              })
            })
          })
        })
      })
    })
  },

  showOne: function(req, res){
    Campaign.findOne({_id: req.params.campaignId}).populate("marketplaces").populate("payments").populate("merchants").exec(function(err, campaign){
      Payment.find({campaign: campaign._id}).populate("giver").populate("taker").exec(function(err, payments){
        campaign.payments = payments;
        res.jsonp(campaign);
      })
    })
  },

  showAll: function(req, res){
    Campaign.find({_id: req.body.id}, function(err, campaigns){
      var deferred = Q.defer();
      campaigns.forEach(function(campaign){

      })
      campaign.populate("marketplaces").populate("payments").populate("merchants").exec(function(err, campaign){
        res.jsonp(campaign);
      })
    })
  }

  // when we add a payment, we need to check whether or not the campaign has tilted
  // otherwise we need to check whether or not campaign funding has closed


  // you should be able to close a campaign
  // you should be able to end funding for a campaign
  // if you do not end fundign for a campaign after it has tilted
  // then campaign funding will come to a close when you submit your work


  // it seems prudent for us to defer checking whether or not a campaign has tilted
  // to a different function
  // if it has tilted, then all the merchants and marketplaces should be notified


  // so i also want to create a function that deals with

  // make sure that all merchants have their credit card information stored
  // when they are creating the campaigns

}

