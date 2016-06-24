import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['alert-item'],

  stateClass: Ember.computed('item.state', function() {
    const state = this.get('item.state');
    let classString = '';

    switch(state) {
      case 1: // host ok
        classString = 'color-green';
        break;
      case 2: // host timeout
        classString = 'color-red';
        break;
      case 8: // service ok
        classString = 'color-green';
        break;
      case 16: // service warning
        classString = 'color-yellow';
        break;
      case 32: // service critical
        classString = 'color-red';
        break;
    }
    return classString;
  }),

  stateTypeString: Ember.computed('item.state_type', function() {
    const state_type = this.get('item.state_type');
    let classString = '';

    switch(state_type) {
      case 1:
        classString = 'HARD';
        break;
      case 2:
        classString = 'SOFT';
        break;
    }
    return classString;
  })

});
