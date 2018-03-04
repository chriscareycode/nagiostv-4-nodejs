# NagiosTV for Nagios 4

This is a version of NagiosTV for Nagios 4.x servers.

Nagios Core 4.0.7 and newer comes with new JSON CGI's
https://labs.nagios.com/2014/06/19/exploring-the-new-json-cgis-in-nagios-core-4-0-7-part-1/
out of the box which is a game changer for tapping into the Nagios data from a web application.
No more need for ndoutils writing out to a database. No more installing 3rd party tools like status-json and MK livestatus to tap into Nagios. Those are great projects, but now we can make NagiosTV available to the most number of users, going with the built-in API.

NagiosTV
------------
Watch one or more Nagios servers on a wall mounted TV (or your desktop)

New items slide in and out of place with animations.

Technology
------------
NagiosTV is a JavaScript single page application. A companion Node.js server (also JavaScript) is also included which can optionally serve the web application and help send (proxy) requests to your Nagios server.

The frontend is using the Ember.js framework.

Screenshot of NagiosTV on desktop
------------

![Display](https://chriscarey.com/software/nagiostv-4/images/nagiostv-screen.png)

Screenshot of NagiosTV on mobile
------------

<img src="https://chriscarey.com/software/nagiostv-4/images/nagiostv-iphone.png" width="300" />

Screenshot of 5 Nagios servers on one TV
------------

This can be accomplished with a simple iframe tag for each region

![Display](http://chriscarey.com/projects/ajax-monitor-for-nagios/nagios-5-in-1.png)

Security
-------------
This is a new project and has a lot of room for improvement before it is ready for use on the public Internet. The first issue would be if your Nagios server web interface is not using TLS (https), the password can be sent in the clear (in the http header). Installing TLS on your Apache server can solve this. The second issue would be the Node.js proxy which allows the web page to communicate to other remote endpoints. An open proxy is bad news on the Internet. Keep this project inside on your private network. If you want to access it remotely, then do so with VPN.

Download NagiosTV
-------------
Download NagiosTV releases from https://github.com/chriscareycode/nagiostv-4/releases
If you `git clone` this project, you will have uncompiled Ember.js code and need to follow the Development section down below to create the dist/ folder. 

Running NagiosTV with the Node.js web server
-------------
Running the Node.js web server offers these features:
- Serves the NagiosTV web application on port :3000
- Can proxy requests to and from your Nagios server
- Nagios username and password can be stored and saved on the server so it is not sent from the browser

To start it:
- Install Node.js https://nodejs.org/
- Open a new terminal.
- Change directory to node/
- Run ./start.sh
- A web server will start on port :3000 that will serve NagiosTV by serving the ../dist folder
- The Node.js server will proxy requests to the Nagios server

Running NagiosTV on your own web server without using the Node.js server
------------
You can do this but it is not the recommended method. Read more in the README-SELF-HOSTED.md file.

Upgrading
------------
Upgrading if you are running a pre-built release of NagiosTV and using the built-in Node.js web server
- Download the new release nagiostv-x.x.x.tar.gz
- Extract the files: tar xvfz nagiostv-x.x.x.tar.gz
- Copy the dist/ and node/ folders over the old NagiosTV files
- Restart the Node.js server
- $ cd node
- $ ./start.sh
- Connect to the server in a web browser


Development instructions below. If you download this project by running `git clone` on the project from GitHub, then you will need to follow this section
------------

Development Requirements
------------
- Git
- Node.js
- Ember.js
- Bower

Development Instructions
------------
- git clone https://github.com/chriscareycode/nagiostv-4.git
- npm install -g ember-cli
- npm install -g bower
- $ cd nagiostv-4
- $ npm install
- $ bower install
- $ ember serve
- access your web server on the hostname and port ember.js shows you, and you can start editing files

Upgrading your development build
- $ cd nagiostv-4
- $ git pull --rebase
- $ ember serve
- access your web server on the hostname and port Ember.js shows you

Upgrading and creating a development build
- $ cd nagiostv-4
- $ git pull --rebase
- $ ember build
- the build is created in the dist/ folder

TODO
------------
Features to work on:
- Fix support for Nagios elements with a period in the name
- Upgrade Ember-CLI and get rid of bower

- Everything is blank on first start. Set a sensible default

Credits
------------
NagiosTV by Chris Carey http://chriscarey.com

Your name here if you want to contribute



