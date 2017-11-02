/*globals moment */

import Ember from 'ember';

export default Ember.Helper.helper(function([date]) {
  var m = moment(date);
  return m.format('MMM D YYYY, hh:mm:ss A');
});
