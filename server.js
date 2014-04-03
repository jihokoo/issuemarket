/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    passport = require('passport'),
    logger = require('mean-logger'),
    sockjs = require('sockjs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    mongoose = require('mongoose');

//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var app = express();

var sockjs_opts = {sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'};
var sockjs_echo = sockjs.createServer(sockjs_opts);

//express settings
require('./config/express')(app, passport);


//Start the app by listening on <port>
var port = config.port;
var server = http.createServer(app);

//Bootstrap routes
require('./config/routes')(app);


var connections = [];



// sockjs_echo.on('connection', function(conn) {
//     connections.push(conn);

//     conn.on('data', function(message) {
//         for (var ii=0; ii < connections.length; ii++) {
//             console.log("hello")
//             connections[ii].write(message);
//         }
//     });
//     conn.on('close', function() {
//         for (var ii=0; ii < connections.length; ii++) {
//             connections[ii].write("User has disconnected");
//         }
//     });
// });


sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
    conn.on('close', function() {
        conn.write("User has disconnected");
    });
});

server.addListener('upgrade', function(req, res){
    res.end();
});

sockjs_echo.installHandlers(server, {prefix: '/echo'});

console.log(' [*] Listening on 0.0.0.0:'+port);
server.listen(port, '0.0.0.0');


//expose app
exports = module.exports = app;
