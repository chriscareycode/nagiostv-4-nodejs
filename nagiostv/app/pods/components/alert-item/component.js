import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  classNames: ['alert-item'],

  stateClass: computed('item.state', function() {
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
      case 64: // service unknown
        classString = 'color-orange';
        break;
    }
    return classString;
  }),

  stateString: computed('item.state', function() {
    const state = this.get('item.state');
    const object_type = this.get('item.object_type');

    let classString = '';

    if (object_type === 1) {
      // Host
      switch(state) {
        case 1:
          classString = 'OK';
          break;
        case 2:
          classString = 'CRITICAL';
          break;
        default:
          classString = 'unknown ' + state;
          break;
      }
    } else if (object_type === 2) {
      // Service
      switch(state) {
        case 8:
          classString = 'OK';
          break;
        case 16:
          classString = 'WARNING';
          break;
        case 32:
          classString = 'CRITICAL';
          break;
        case 64:
          classString = 'UNKNOWN';
          break;
        default:
          classString = 'unknown ' + state;
          break;
      }
    }
      

    return classString;
  }),

  stateTypeString: computed('item.state_type', function() {
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
