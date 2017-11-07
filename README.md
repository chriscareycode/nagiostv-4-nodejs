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

Screenshot on desktop
------------

![Display](https://chriscarey.com/software/nagiostv-4/images/nagiostv-screen.png)

Screenshot on mobile
------------

<img src="https://chriscarey.com/software/nagiostv-4/images/nagiostv-iphone.png" width="300" />

Screenshot of 5 Nagios servers on one TV
------------

This can be accomplished with a simple iframe tag for each region

![Display](http://chriscarey.com/projects/ajax-monitor-for-nagios/nagios-5-in-1.png)

Running NagiosTV
-------------
We are now able to connect the web application direct to Nagios CGIs with a couple changes on the Nagios Apache server.

There are a few options to run NagiosTV
You can run the development build, or you can run with the pre-built release.
The pre-built release will untar with a dist/ and a node/ folder
The node server included is optional and can be used to serve the NagiosTV web interface and proxy requests.

Security
-------------
This is a new project and has a lot of room for improvement before it is ready for use on the public Internet. The first issue would be if your Nagios server web interface is not using TLS (https), the password can be sent in the clear (in the http header). Installing TLS on your Apache server can solve this. The second issue would be the Node.js proxy which allows the web page to communicate to other remote endpoints. An open proxy is bad news on the Internet. Keep this project inside on your private network. If you want to access it remotely, then do so with VPN.

Serving NagiosTV Option #1 - NagiosTV with the Node.js web server
-------------
Running the Node.js web server is optional and offers these features:
- Serves the NagiosTV web application on port :3000
- Can proxy requests to and from your Nagios server
- Nagios username and password can be stored and saved on the server so it is not sent from the browser

To start it:
- Open a new terminal.
- Change directory to node/
- Run ./start.sh
- A web server will start on port :3000 that will serve NagiosTV by serving the ../dist folder
- The Node.js server will proxy requests to the Nagios server, bypassing some restrictions

Proxying requests to your Nagios server using the Node.js server
------------
We can proxy, or bounce the connection from the NagiosTV web application through the Node.js server (included) in order to bypass CORS restrictions on the browser, or to bypass other issues such as http protocol mismatch errors (when NagiosTV is served on a TLS https website, but your Nagios server is served on a http website).

Serving NagiosTV Option #2 - Using pre-built NagiosTV release on your own web server
-------------
Download the latest nagios release from https://github.com/chriscareycode/nagiostv-4/releases
Copy the contents of the dist/ folder to your web server
Access the web server to run NagiosTV
Configure the Settings within NagiosTV
Save the settings (settings will be saved to your browser)
NagiosTV will connect directly to your Nagios server
* After setting the server, username, and password, if you are still having trouble connecting, check the web browser developer console for errors.
* Depending on your configuration, your browser may be sending authentication information to the Nagios server in the clear. To solve this, use the Node.js server method, or enable TLS on your Nagios Apache web interface.

Changes needed on the Nagios Apache server to enable CORS
-------------

You only need to do this change *IF* you want to have direct connect from the browser to the Nagios server. If you are serving NagiosTV from your own web server and not using the built-in Node.js server then you need to make this change. If you want to use the proxy method, then *no* changes are needed on the Nagios server.

At this time, the built-in Nagios CGIs do not support direct access from JavaScript. Currently the Nagios server will return a 401 Unauthorized when the OPTIONS request is sent. Endpoints need to return a header Access-Control-Allow-Origin: * to the browser and in addition, when the browser sends an initial OPTIONS request to the server, the server needs to return a "200 OK" *without authentication*. To accomplish this, we make a few edits to the Apache server that is running the Nagios web interface:

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

After the changes are made, restart or reload apache and make sure it is happy and serving the Nagios web interface.
If I can find out who to talk to at Nagios about fixing this, I would like to get these changes added to Nagios core by default.

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

Upgrading if you are running a pre-built release on your own web server
- Download the new release nagiostv-x.x.x.tar.gz
- tar xvfz nagiostv-x.x.x.tar.gz
- Copy the contents of the dist/ folder to your web server inside the old NagiosTV folder
- Connect to the server in a web browser

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

Credits
------------
NagiosTV by Chris Carey http://chriscarey.com

Your name here if you want to contribute



