
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
var fs = require('fs');
var bodyParser = require('body-parser');
// express-http-proxy https://github.com/villadora/express-http-proxy
var proxy = require('express-http-proxy');

//=============================================================================
// Settings
//=============================================================================

let settings;
let settingsJson;

// Load the settings.js file, if it exists
try {
  const stats = fs.lstatSync('settings.js');
  if (stats.isFile()) { console.log('settings.js file found. This is where the Node.js server settings are stored.'); }
  settings = require('./settings');
}
catch (e) {
  console.log('****************************************************************************************************************');
  console.log('No settings.js file found. This is where the Node.js server settings are stored.')
  console.log('Copy the file settings.dist.js to settings.js and edit settings.js if you want to. The settings.js file will not be overwritten by updates.');
  console.log('****************************************************************************************************************');
  process.exit();
}

loadSettingsJson();

//=============================================================================
// loadSettings and saveSettings
//=============================================================================
function loadSettingsJson() {
  // Load the settings-json.js file, if it exists
  try {
    const stats = fs.lstatSync('settings-json.js');
    if (stats.isFile()) { console.log('settings-json.js file found.'); }
    settingsJson = require('./settings-json');
    console.log('Nagios Server: ' + settingsJson.nagiosServerHost);
  } catch (e) {
    console.log('****************************************************************************************************************');
    console.log('No settings-json.js found. This is where the webUI will store it\'s settings, once you save them to the server.');
    console.log('You can copy the file settings-json.dist.js to settings-json.js and edit the file manually. The settings-json.js file will not be overwritten by updates.');
    console.log('****************************************************************************************************************');
  }
}

function clearSettings(req, res) {
  let stats;
  try {
    stats = fs.lstatSync('settings-json.js');
  } catch (e) {
    console.log('settings-json.js file not found');
  }
  if (stats && stats.isFile()) {
    // delete the file
    fs.unlink('settings-json.js', (err) => {
      if (err) throw err;
      console.log('successfully deleted settings-json.js');

      res.json({
        status: 'settings-json.js cleared'
      });
    });
  } else {
    res.json({
      status: 'settings-json.js file not found'
    });
  }
}

function sendSettings(req, res) {
  console.log('sendSettings()');
  // Send settings but without password
  const settingsWithoutPassword = Object.assign({}, settingsJson, {
    password: ''
  });
  console.log(settingsWithoutPassword);
  res.json(settingsWithoutPassword);
}

function saveSettings(req, res) {
  console.log('saveSettings()');
  //console.log(req.body);

  if (!req.body) {
    console.log('saveSettings() no data so no save');
    return;
  }

  var text = 'module.exports = ' + JSON.stringify(req.body, null, "\t");
  fs.writeFile('settings-json.js', text, (err) => {
    if(err) {
      res.send({
        success: false,
        successMessage: 'Failure writing to file.'
      });
      return console.log(err);
    }
    console.log("The file was saved!");
    console.log(text);

    res.send({
      success: true,
      successMessage: 'Thanks for the settings.'
    });

    // save the settings locally
    settingsJson = req.body;
    // update the proxy
    decorateProxyOptions();
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

// GET Clear settings
app.get('/settings-clear', function(req, res) {
   clearSettings(req, res);
});

// GET Load settings
app.get('/settings', function(req, res) {
   sendSettings(req, res);
});

// POST Save settings
app.post('/settings', function(req, res) {
   saveSettings(req, res);
});

//***********************************************************************
//* Start Proxy
//***********************************************************************

let proxyUrl = '';
if (settingsJson) { proxyUrl = settingsJson.nagiosServerHost + settingsJson.nagiosServerCgiPath + '/:resource'; }
console.log('Will proxy requests to ' + proxyUrl);

var proxyOptions = {
  proxyReqPathResolver: function(req) {
    if (settings.debug) { console.log('Proxying to URL: ' + proxyUrl + req.url); }
    return require('url').parse(req.url).path;
  },
  proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
    proxyReqOpts.rejectUnauthorized = false
    return proxyReqOpts;
  }
};

// Add auth if it is enabled
if (settingsJson && settingsJson.auth) {
  proxyOptions.headers = {
    Authorization: "Basic " + new Buffer(settingsJson.username + ':' + settingsJson.password).toString('base64')
  };
}

app.get('/nagios/:resource', proxy(proxyUrl + '/:resource', proxyOptions));

//***********************************************************************
//* End Proxy
//***********************************************************************

// Server listen on port
app.listen(settings.serverPort);

console.log('Listening on port ' + settings.serverPort + '...');
console.log(' ');
console.log('You can now open a web browser to http://127.0.0.1:' + settings.serverPort);
console.log('(Replace 127.0.0.1 with your IP address, if needed.)');
console.log(' ');
