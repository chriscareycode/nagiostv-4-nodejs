/*****
 * Configurable Settings - Set your Nagios username and password here
 *****/

module.exports = {

  serverPort: 3000,

  nagiosServerHost: 'http://192.168.1.2',
  nagiosServerPath: '/nagios/cgi-bin/',
  auth: true,
  username: 'nagiosadmin',
  password: 'changeme'

};
