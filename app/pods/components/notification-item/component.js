import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['notification-item'],

  stateClass: Ember.computed('item.notification_type', function() {
    const notification_type = this.get('item.notification_type');
    let classString = '';

    switch(notification_type) {
      case 512:
        classString = 'color-green';
        break;
      case 256:
        classString = 'color-yellow';
        break;
      case 128:
        classString = 'color-red';
        break;
      case 16:
        // Host Unreachable?
        classString = 'color-red';
        break;
      case 1:
        // Host Unreachable?
        classString = 'color-red';
        break;
    }
    return classString;
  })

});
