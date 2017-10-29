# NagiosTV 4

This is a version of NagiosTV for Nagios 4.x servers.

Nagios Core 4.0.7 and newer comes with new JSON CGI's
https://labs.nagios.com/2014/06/19/exploring-the-new-json-cgis-in-nagios-core-4-0-7-part-1/
out of the box which is a game changer for tapping into the Nagios data from a web application.
No more need for ndoutils writing out to a database. No more installing 3rd party tools like status-json and MK livestatus to tap into Nagios. Those are great projects, but now we can make NagiosTV available to the most number of users, going with the built-in API. This release is the fastest, lightest, simplest to install NagiosTV yet.

NagiosTV
------------

Watch one or more Nagios servers on a wall mounted TV (or your desktop)

New items slide in and out of place with animations.

- Client Side: EmberJS 2.x
- Server Side: Node.js

Screenshot of NagiosTV 4
------------

![Display](https://chriscarey.com/software/nagiostv-4/images/nagiostv-screen.png)

Looks good on mobile
------------

![Display](https://chriscarey.com/software/nagiostv-4/images/nagiostv-iphone.png)

Screenshot of 5 Nagios servers on one TV
------------

This can be accomplished with a simple iframe tag for each region

![Display](http://chriscarey.com/projects/ajax-monitor-for-nagios/nagios-5-in-1.png)

Running NagiosTV 4
-------------
We are now able to connect the web application direct to Nagios CGIs with a couple changes on the Nagios Apache server.

There are a few options to run NagiosTV
You can run the development build, or you can run with the pre-built release.
The pre-built release will untar with a dist/ and a node/ folder
The node server included is optional and can be used to serve the NagiosTV web interface.

Changes needed for Nagios Apache server
-------------

/etc/apache/sites-enabled/nagios.conf

```html
# Inside <Directory> add these to add CORS headers

  Header set Access-Control-Allow-Headers "authorization" 
  Header always set Access-Control-Allow-Origin "*"

# Then, wrap the Require valid-user with this <LimitExcept>

<LimitExcept OPTIONS>
  Require valid-user
</LimitExcept>
```

Then restart or reload apache and make sure it is happy and serving the Nagios web interface.

Serving the pre-built dist/ folder on your own web server
-------------
Download the latest nagios release from https://github.com/chriscareycode/nagiostv-4/releases
Copy the contents of the dist/ folder to your web server
Access the web server to run NagiosTV
Configure the Settings within NagiosTV
NagiosTV will connect directly to your Nagios server
After setting the server, username, and password, if you are still having trouble connecting, check the web browser developer console for errors.

Running the Node.js web server
-------------
Running the Node.js web server is optional and offers these features:
- Serves the NagiosTV web application on port :3000
- Optionally will proxy requests to your Nagios server (coming soon)

To start it:
- Open a new terminal.
- Change directory to node/
- Run ./start.sh
- A web server will start on port :3000 that will serve NagiosTV by serving the ../dist folder

Proxying requests to your Nagios server using the Node.js server
------------
We can proxy, or bounce the connection from the NagiosTV web application through the Node.js server (included) in order to bypass CORS restrictions on the server, or to bypass other issues such as http protocol mismatch errors (when NagiosTV is served on a TLS https website, but your Nagios server is served on a http website). This capability does exist and is something that is working but I did not ship initially. Based on feedback I would like to enable this functionaly back in with configuration in-app.

Upgrading
------------
Upgrading if you are running a pre-built release
- Download the new release nagiostv-x.x.x.tar.gz
- tar xvfz nagiostv-x.x.x.tar.gz
- Copy the contents of the dist/ folder to your web server inside the old NagiosTV folder

Upgrading and running a development build
- $ cd nagiostv-4
- $ git pull --rebase
- $ ember serve
- access your web server on the hostname and port ember.js shows you

Upgrading and creating a build if you are running development
- $ cd nagiostv-4
- $ git pull --rebase
- $ ember build
- then copy the contents of the dist/ directory to your web server

Development Requirements
------------
- Git
- Node.js
- Ember.js
- Bower

Development
------------
- npm install -g ember
- npm install -g bower
- git clone https://github.com/chriscareycode/nagiostv-4.git
- $ cd nagiostv-4
- $ npm install
- $ bower install
- $ ember serve
- access your web server on the hostname and port ember.js shows you

TODO
------------
Features to work on next
- Fix support for Nagios elements with a period in the name
- Add back in Node.js proxy support
- Edit Node server from the browser

Credits
------------
NagiosTV by Chris Carey
http://chriscarey.com


