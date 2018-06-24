/*eslint-disable no-console*/
import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    closeSettingsAction: function() {
      console.log('closeSettingsAction in the controller');
    }
  }
});
