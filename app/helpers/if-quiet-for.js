import Ember from 'ember';

export default Ember.Helper.helper(function([timestamp, index, minutes, notificationlist]) {

  let previousTimestamp = notificationlist[index-1].timestamp;
  let diff = previousTimestamp - timestamp;
  if (diff > minutes * 60 * 1000) {
    return true;
  } else {
    return false;
  }

});
