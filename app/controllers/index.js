/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User'),
    _ = require('underscore');


exports.render = function(req, res) {
    console.log(typeof req.user);
    res.render('index', {
        user: req.user || null
    });
};




