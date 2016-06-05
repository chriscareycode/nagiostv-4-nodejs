import Ember from 'ember';

export default Ember.Helper.helper(function([state]) {
  switch(state) {
    case 0:
      return 'SOFT';
    case 1:
      return 'HARD';

  }
  return 'Unknown state '+state;
});
