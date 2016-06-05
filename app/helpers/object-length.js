import Ember from 'ember';

export default Ember.Helper.helper(function([myObj]) {
  return Object.keys(myObj).length;
});
