import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    closeSettingsAction: function() {
      console.log('closeSettingsAction in the controller');
    }
  }
});
