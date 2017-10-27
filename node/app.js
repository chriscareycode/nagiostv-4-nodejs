
/*
 * TODO:
 * - Add a settings file and move the username password for Nagios in there.
 *
 */

//=============================================================================
// Requires
//=============================================================================

var express = require('express');
var app = express();
var cors = require('cors');
//var http = require('http');
//var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');
var requestProxy = require('express-request-proxy');

//=============================================================================
// Settings
//=============================================================================

var settings;

// Load the settings file, if it exists
try {
  stats = fs.lstatSync('settings.js');
  settings = require('./settings');
  if (stats.isFile()) { console.log('settings.js file found.'); }
}
catch (e) {
  console.log('Copy the file settings.dist.js to settings.js and edit settings.js');
  process.exit();
}

// Check if the user changed the username and password in settings.js
if (settings.username === 'changeme') {
  console.log('Please set username and password for Nagios web interface in settings.js');
  process.exit();
}

//=============================================================================
// loadSettings and saveSettings
//=============================================================================

function loadSettings(req, res) {
  console.log('loadSettings');
  const settingsNoPassword = {};
  for (var s in settings) {
    if (s !== 'password') {
      settingsNoPassword[s] = settings[s];
    }
  }
  res.send(settingsNoPassword);
}

function saveSettings(req, res) {
  console.log('saveSettings');
  //console.log(req.body);
  var text = 'module.exports = ' + JSON.stringify(req.body, null, "\t");
  fs.writeFile('settings-json.js', text, function(err) {
    if(err) {
      res.send({
        success: false,
        successMessage: 'Failure writing to file.'
      });
      return console.log(err);
    }
    console.log("The file was saved!");
    res.send({
      success: true,
      successMessage: 'Thanks for the settings.'
    });
  });

}

//=============================================================================
// Set up routes
//=============================================================================

app.use(cors());

// to support JSON-encoded bodies
app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static('../dist'));

// GET Load settings
app.get('/settings', function(req, res) {
   loadSettings(req, res);
});

// POST Save settings
app.post('/settings', function(req, res) {
   saveSettings(req, res);
});

// Proxy to Nagios server
var proxyOptions = {
  url: settings.nagiosServerHost + settings.nagiosServerPath + ':resource'
};
if (settings.auth) {
  proxyOptions.headers = {
    Authorization: "Basic " + new Buffer(settings.username + ':' + settings.password).toString('base64')
  };
}
app.get('/nagios/:resource', requestProxy(proxyOptions));

// Server listen on port
app.listen(settings.serverPort);

console.log('Listening on port ' + settings.serverPort + '...');
