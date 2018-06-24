/* eslint no-console: "off" */
/*jshint unused:false*/

/*
 * Nagios Ember Service
 *
 * TODO:
 * save and load settings to localStorage or cookie
 *
 *
 * convert convertHostListFromNagios4 into a shared with convertServiceListFromNagios4
 */
import Service from '@ember/service';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import { set } from '@ember/object';
import DeepDiff from 'deep-diff';
import $ from 'jquery';

export default Service.extend({

  currentVersion: 5,
  currentVersionString: '1.3.0',
  latestVersion: 0,
  latestVersionString: '',
  newVersionAvailable: false,

  init() {
    this._super(...arguments);

    // Settings which will get saved
    this.settings = {
      title: 'NagiosTV for Nagios 4',
      iconUrl: '/images/tv-xxl.png',
      connectionStyle: 'proxy', // direct, proxy
      nodeServerHost: 'http://127.0.0.1:3000',
      nodeServerPath: '/nagios',
      nagiosServerHost: 'http://example.com',
      nagiosServerCgiPath: '/nagios/cgi-bin',
      auth: true,
      username: 'nagiosadmin',
      password: '',
      showUnknownServiceItems: false
    };

    this.hostlist = {};
    this.servicelist = {};
    //this.notificationlist = [];
    this.alertlist = [];

  },

  //cgi-bin/statusjson.cgi
  //nagios/jsonquery.html

  isPolling: false,
  timerIntervalSeconds: 15,
  timerHandle: null,

  connectionStatus: '',
  connectionError: false,
  connectionErrorMessage: '',

  dateLastUpdate: null,
  dateLastUpdateUnix: null,

  /***************************************************************************
   * Computed Properties
   ***************************************************************************/

  servicelistCount: computed('servicelist', function() {
    let count = 0;
    let servicelist = this.get('servicelist');
    for (let host in servicelist) {
      /*eslint-disable*/
      for (let service in servicelist[host]) { // jshint ignore:line
        count++;
      }
      /*eslint-enable*/
    }
    return count;
  }),

  servicelistDownCount: computed('servicelist', function() {
    let count = 0;
    let servicelist = this.get('servicelist');
    for (let host in servicelist) {
      for (let service in servicelist[host]) {
        if (servicelist[host][service].status !== 2) { count++; }
      }
    }
    return count;
  }),

  hostlistDownCount: computed('hostlist.length', function() {
    let count = 0;
    let hostlist = this.get('hostlist');
    for (let host in hostlist) {
      if (hostlist[host].status !== 2) { count++; }
    }
    return count;
  }),

  /***************************************************************************
   * Functions (public)
   ***************************************************************************/

  /**************************************
   * Settings
   **************************************/

  fetchLocalSettings: function() {
    const cat = localStorage.getItem('nagiostv-settings');
    const loadedSettings = JSON.parse(cat);
    if (loadedSettings) {
      // overlay the loaded settings over top of the default settings
      // this helps prevent issues when we add new settings
      const defaultSettings = this.get('settings');
      const mergedSettings = Object.assign({}, defaultSettings, loadedSettings);
      this.set('settings', mergedSettings);
    }
  },

  saveLocalSettings: function() {
    console.log('saveLocalSettings()');
    localStorage.setItem('nagiostv-settings', JSON.stringify(this.settings));
  },

  clearLocalSettings: function() {
    console.log('clearLocalSettings()');
    localStorage.removeItem('nagiostv-settings');
  },

  fetchProxySettings: function() {
    this.fetchProxySettingsPromise().then((data) => {
      console.log('fetchProxySettings success');
      console.log(data);
      console.log('Overwriting local settings with server settings');

      // add any new settings since we have a catch22 where the missing setting will overwrite from the server
      // set defaults on those new settings here
      if (!data.hasOwnProperty('showUnknownServiceItems')) {
        data.showUnknownServiceItems = false;
      }
      // save the settings from the node server into local settings
      this.set('settings', data);
    }, (err) => {
      console.log('fetchProxySettings error', err);
    });
  },

  fetchProxySettingsPromise: function() {
    var nodeServerHost = this.get('settings.nodeServerHost');
    return new Promise((resolve, reject) => {
      $.ajax({
        url: nodeServerHost + '/settings',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(fail) {
          reject(fail);
        }
      });
    });
  },

  saveProxySettings: function() {
    console.log('saveProxySettings()');

    console.log(this.settings);

    // save a subset of the settings locally
    const localSettings = {};
    localSettings.connectionStyle = this.settings.connectionStyle;
    localSettings.nodeServerHost = this.settings.nodeServerHost;
    localSettings.nodeServerPath = this.settings.nodeServerPath;
    localStorage.setItem('nagiostv-settings', JSON.stringify(localSettings));

    // send the settings to the proxy
    var settings = this.get('settings');
    return new Promise((resolve, reject) => {
      $.ajax({
        url: settings.nodeServerHost + '/settings',
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(settings),
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(fail) {
          reject(fail);
        }
      });
    });

  },

  clearProxySettings: function() {
    console.log('clearProxySettings()');
    var nodeServerHost = this.get('settings.nodeServerHost');
    return new Promise((resolve, reject) => {
      $.ajax({
        url: nodeServerHost + '/settings-clear',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(fail) {
          reject(fail);
        }
      });
    });
  },

  /**************************************
   * Timers
   **************************************/

  startTimer: function() {
    // Fetch one right away
    this.fetchUpdate();
    const timerIntervalSeconds = this.get('timerIntervalSeconds');
    const timerHandle = setInterval(() => {
      this.fetchUpdate();
    }, timerIntervalSeconds * 1000);
    this.set('isPolling', true);
    this.set('timerHandle', timerHandle);

    this.versionCheck();
  },

  stopTimer: function() {
    clearInterval(this.get('timerHandle'));
    this.set('isPolling', false);
  },

  fetchUpdate: function() {
    this.fetchUpdateFromNagios4();
  },

  getJSON: function(url) {
    const username = this.get('settings.username');
    const password = this.get('settings.password');
    let headers = {};
    if (username && password) {
      headers['Authorization'] = "Basic " + btoa(username + ":" + password);
    }

    return new Promise(function(resolve, reject) {
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        username: username,
        password: password,
        headers: headers,
        success: function(data) {
          //console.log('getJSON got data', data);
          resolve(data);
        },
        error: function(fail) {
          console.log('getJSON failure - ' + url, fail);
          reject(fail);
        }
      });
    });
  },

  versionCheck: function() {
    this.versionCheckFetch();
    // check once per day
    setInterval(() => {
      this.versionCheckFetch();
    }, 86400 * 1000);
  },

  versionCheckFetch: function() {
    const currentVersion = this.get('currentVersion');
    $.getJSON('https://chriscarey.com/software/nagiostv-4/version/json/').then((d) => {
      next(() => {
        this.set('latestVersion', d.version);
        this.set('latestVersionString', d.version_string);
        if (d.version > currentVersion) {
          this.set('newVersionAvailable', true);
        }
      });
    }, (err) => {
      next(() => {
        console.log('There was an error checking for the latest version.', err);
      });
    });
  },

  /***************************************************************************
   * Functions (private)
   ***************************************************************************/

  fetchUpdateFromNagios4: function() {

    var that = this;
    var settings = this.get('settings');

    let baseUrl;
    let basePath;
    // switch for direct vs proxy connection
    if (settings.connectionStyle === 'proxy') {
      baseUrl = settings.nodeServerHost;
      basePath = settings.nodeServerPath;
    } else {
      baseUrl = settings.nagiosServerHost;
      basePath = settings.nagiosServerCgiPath;
    }

    next(() => {
      this.getJSON(baseUrl + basePath + '/statusjson.cgi?query=hostlist&details=true').then((data) => {

        this.set('connectionStatus', 'Connected');

        // perform diff and set the data
        this.set('connectionError', false);
        this.diffFromNagios4('hostlist', data);
      }, (err) => {
        console.log('err', err);
        this.set('connectionStatus', 'Problem');
        this.set('connectionError', true);

        switch(err.status) {
          case 401:
            this.set('connectionErrorMessage', 'Error ' + err.status + ' ' + err.statusText + ' - Check the username and password on the settings screen and save.');
            break;
          default:
            this.set('connectionErrorMessage', 'Error ' + err.status + ' ' + err.statusText);
            break;
        }
      });
    });

    this.getJSON(baseUrl + basePath + '/statusjson.cgi?query=servicelist&details=true').then(function(data) {
      // perform diff and set the data
      that.diffFromNagios4('servicelist', data);

      // set last update date for display to the screen and use in various triggers
      that.set('dateLastUpdate', new Date());
      that.set('dateLastUpdateUnix', new Date().getTime());
    });

    // TODO: move this onto it's own timer
    var starttime = '-200000';

    this.set('connectionStatus', 'Connecting...');

    // alertlist
    this.getJSON(baseUrl + basePath + '/archivejson.cgi?query=alertlist&starttime='+starttime+'&endtime=%2B0').then((data) => {



      // sort the list newest first
      data.data.alertlist = data.data.alertlist.sort(function(o1, o2) {
        if (o1.timestamp < o2.timestamp) { return 1; }
        else if(o1.timestamp > o2.timestamp) { return  -1; }
        else { return  0; }
      });

      // trim the top 1000 to not overwhelm the browser
      // if (data.data.alertlist.length > 500) {
      //   data.data.alertlist = data.data.alertlist.slice(0, 500);
      // }

      // perform diff and set the data
      that.diffFromNagios4('alertlist', data);
    });


  }, // fetchUpdateFromNagios4()

  diffFromNagios4: function(obj_name, obj_raw_data) {
    let the_object = this.get(obj_name);
    const differences = DeepDiff.diff(the_object, obj_raw_data.data[obj_name]);

    //this.propertyWillChange(obj_name);

    if (differences) {
      differences.forEach(function(d) {
        //console.log('d is', d);
        switch(d.kind) {
          case 'A':
            //Ember.set(the_object, obj_raw_data.data[obj_name]);
            //the_right_object = obj_raw_data.data[obj_name];
            if (d.item.kind === 'N') {
              the_object.pushObject(d.item.rhs);
            } else if (d.item.kind === 'D') {
              if (d.index && the_object.length > d.index) { the_object.removeAt(d.index); }
            } else {
              console.log('A unknown d', d);
            }
            break;
          case 'N':
            if (d.path) {
              //console.log('N ', the_object, d.path[0], obj_raw_data.data[obj_name][d.path[0]]);
              //console.log('N', the_object instanceof Array);
              if (the_object instanceof Array) {
                set(the_object, d.path[0].toString(), obj_raw_data.data[obj_name][d.path[0]]);
              }else {
                set(the_object, d.path[0], obj_raw_data.data[obj_name][d.path[0]]);
              }
            } else {
              console.log('N unknown d', d);
            }
            break;
          case 'E':
            //console.log('d is', d);
            //console.log('obj_raw is ', obj_raw_data.data[obj_name]);
            //console.log('d.path is', d.path);
            //console.log();
            if (d.path) {
              //console.log('E ', the_object, d.path[0], obj_raw_data.data[obj_name][d.path[0]]);
              //console.log('E', the_object instanceof Array);
              if (the_object instanceof Array) {
                set(the_object[d.path[0]], d.path[1].toString(), obj_raw_data.data[obj_name][d.path[0]][d.path[1]]);
              } else {
                set(the_object[d.path[0]], d.path[1], obj_raw_data.data[obj_name][d.path[0]][d.path[1]]);
              }
            } else {
              console.log('E unknown d', d);
            }
            break;
          case 'D':
            delete the_object[d.path[0]][d.path[1]];
            break;
          default:
            console.log('unknown d', d);
            break;
        }
      });
    }

    this.notifyPropertyChange(obj_name);
  }

});
