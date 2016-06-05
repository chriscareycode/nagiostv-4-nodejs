import Ember from 'ember';

export default Ember.Helper.helper(function([status]) {
  switch(status) {
  	case 1:
      return 'NOT CHECKED';
    case 2:
      return 'OK';
    case 4:
      return 'WARNING';
    case 16:
      return 'CRITICAL';
  }
  return 'Unknown status '+status;
});
