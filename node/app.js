
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
var http = require('http');
var url = require('url');
var fs = require('fs');

var bodyParser = require('body-parser');

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
  console.log('Copy the file settings.dist.js to settings.js');
  process.exit();
}

// Check if the user changed the username and password in settings.js
if (settings.username === 'changeme') {
  console.log('Please set username and password for Nagios web interface in settings.js');
  process.exit();
}

//=============================================================================
// Private Functions
//=============================================================================

function getNagios(req, res) {

  //var username = settings.username;
  //var password = settings.password;

  //var auth = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');
  var page = req.params.page;
  var url_parts = url.parse(req.url, true);
  var queryparams = url_parts.query;

  // console.log('req.url');
  // console.log(req.url);

  // console.log('url_parts');
  // console.log(url_parts);

  // console.log('params');
  // console.log(req.params);

  // console.log('queryparams');
  // console.log(queryparams);

  var path = '/nagios/cgi-bin/'+page+url_parts.search;

  var options = {
    host: settings.nagiosServerHost,
    port: 80,
    path: path
  };

  // add auth to the payload if settings.auth === true
  if (settings.auth) { options.auth = settings.username+':'+settings.password; }

  console.log('requesting URL ' + options.host + ':' + options.port + options.path);

  http.get(options, function(resp){
    //resp.setEncoding('utf8');
    var body = '';

    resp.on('data', function(chunk){
      body += chunk;
    });
    resp.on('end', function(){
      //do something with chunk
      if (body === '') {
          console.log('body is empty. sending default');
          //res.redirect('/images/broken-image.gif');
          return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    res.send('Got error: ' + e.message);
  }).end();

  return;
}

//=============================================================================
// loadSettings and saveSettings
//=============================================================================

function loadSettings(req, res) {
  console.log('loadSettings');
  //console.log(req);
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
  console.log(req.body);

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

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/', express.static('../dist'));

app.get('/settings', function(req, res) {
   loadSettings(req, res);
});

app.post('/settings', function(req, res) {
   saveSettings(req, res);
});

app.get('/nagios/:page', function(req, res) {
   getNagios(req, res);
});

app.listen(3000);

console.log('Listening on port 3000...');
