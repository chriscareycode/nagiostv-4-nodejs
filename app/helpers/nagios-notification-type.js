/*
 * A string identifying the type of notification that is being sent
 * ("PROBLEM", "RECOVERY", "ACKNOWLEDGEMENT", "FLAPPINGSTART", "FLAPPINGSTOP",
 * "FLAPPINGDISABLED", "DOWNTIMESTART", "DOWNTIMEEND", or "DOWNTIMECANCELLED").
 * https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/macrolist.html#notificationtype
 * https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/notifications.html
 */

import Ember from 'ember';

export default Ember.Helper.helper(function([state]) {
  switch(state) {
    case 1:
      return 'UNREACHABLE?'; //host
    case 4:
      return 'RECOVERY/UP?'; //host
    case 16:
      return 'UNREACHABLE?'; //host
    case 128:
      return 'CRITICAL'; //service
    case 256:
      return 'WARNING'; //service
    case 512:
      return 'OK'; //service
    case 1024:
      return 'UNKNOWN1024';
    case 2048:
      return 'ACKNOWLEDGED'; //service
    case 4096:
      return 'FLAPPINGDISABLED';

    case 3001:
      return 'FLAPPINGSTART';
    case 3002:
      return 'FLAPPINGSTOP'; //service
    case 3003:
      return 'FLAPPINGDISABLED';

    case 4001:
      return 'DOWNTIMESTART';
    case 4002:
      return 'DOWNTIMESTOP';
    case 4003:
      return 'DOWNTIMECANCELLED';
  }
  return 'Unknown nagios-notification-type '+state;
});
