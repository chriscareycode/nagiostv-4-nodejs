# NagiosTV 4

This is a version of NagiosTV for Nagios4 servers.

Nagios4 comes with new JSON CGI's
https://labs.nagios.com/2014/06/19/exploring-the-new-json-cgis-in-nagios-core-4-0-7-part-1/

NagiosTV
------------

Watch one or more Nagios servers on a wall mounted TV (or your desktop)

New items slide in and out of place with animations.

- Client Side: EmberJS 2.x
- Server Side: Node.js

Screenshot of 5 Nagios servers on one TV (5-in-1)
------------

![Display](http://chriscarey.com/projects/ajax-monitor-for-nagios/nagios-5-in-1.png)


Requirements
------------

Node.js

Installation
------------

- git clone https://github.com/chriscareycode/nagiostv-4.git
- $ cd nagiostv-4/node
- $ npm install
- $ cp settings.dist.js settings.js
- edit settings.js with your own settings

Running NagiosTV 4
-------------
The JSON CGIs provided with Nagios 4 do not currently support CORS. Instead of patching Nagios,
we use a Node.js server to proxy commands over to the JSON CGIs and handle authentication to those CGIs.
This bypasses the JavaScript cross origin issues. The JavaScript application talks to the Node.js server,
and the Node.js server talks to Nagios 4 JSON CGIs.

Start the Node.js server like this:
$ cd nagiostv-4/node
$ node app.js

Now you should be able to hit http://<server-ip-address>:3000 and see the application.
If you are working on the same machine running the server, it would be http://localhost:3000

Upgrading
------------
- $ cd nagiostv-4
- $ git pull

Your customized config file (node/settings.js) will not be overwritten.
  You may want to check config.php.dist and config.js.dist for new options
  until I get around to automating that process.
  
Development
------------
- Install ember-cli
- TODO


TODO
------------
Features to work on next
- 

Credits
------------
NagiosTV by Chris Carey
http://chriscarey.com

The Ember.js readme is below:

===============================================================================

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

