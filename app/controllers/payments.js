var mongoose = require('mongoose');
var request = require('request');
var Payment = mongoose.model('Payment');
var User = mongoose.model('User');
var Campaign = mongoose.model('Campaign');


// do i need a separate controller for payments
// this is really just adding to the campaign object as opposed
// to anything else
