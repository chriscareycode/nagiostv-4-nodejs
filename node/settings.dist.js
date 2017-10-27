/*****
 * Configurable Settings - Set your Nagios username and password here
 *****/

module.exports = {

  serverPort: 3000,
  
  nagiosServerHost: 'http://10.69.1.52',
  nagiosServerPath: '/nagios/cgi-bin/',
  auth: true,
  username: 'nagiosadmin',
  password: 'changeme'

};
