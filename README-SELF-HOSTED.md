Serving NagiosTV Option #2 - Using pre-built NagiosTV release on your own web server
-------------

If you want to use your own web server to serve the NagiosTV web app, and not use the Node.js server, then you can follow this part.

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

Upgrading if you are running a pre-built release on your own web server
- Download the new release nagiostv-x.x.x.tar.gz
- tar xvfz nagiostv-x.x.x.tar.gz
- Copy the contents of the dist/ folder to your web server inside the old NagiosTV folder
- Connect to the server in a web browser
