import Component from '@ember/component';
import { inject as injectService } from '@ember/service';
import { next } from '@ember/runloop';
import { later } from '@ember/runloop';
import { computed } from '@ember/object';

export default Component.extend({

  nagios: injectService(),

  dateDriftSeconds: null,

  dateDrift: 0,

  didInsertElement: function() {
    next(() => {
      this.afterDidInsertElement();
    });
  },

  afterDidInsertElement: function() {
    const that = this;
    const nagios = this.get('nagios');

    nagios.fetchLocalSettings();

    nagios.fetchProxySettings();

    const timerForDateDrift = setInterval(function() {
      that.timerFired();
    }, 5000);

    later(function() {
      nagios.startTimer();
      that.set('timerForDateDrift', timerForDateDrift);
    }, 1000);
  },

  willDestroyElement: function() {
    this.get('nagios').stopTimer();
    clearInterval(this.get('timerForDateDrift'));
  },

  connectionStatusClass: computed('nagios.connectionStatus', function() {
    switch(this.get('nagios.connectionStatus')) {
      case 'Connected':
      case 'Connecting...':
        return 'color-green';
      default:
        return '';
    }
  }),

  startTheTimer: function() {

  },

  timerFired: function() {
    const dateLastUpdate = this.get('nagios.dateLastUpdate');
    const dateDrift = new Date().getTime() - dateLastUpdate;
    this.set('dateDrift', dateDrift);
  }



});
