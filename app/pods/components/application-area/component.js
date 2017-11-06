import Ember from 'ember';

export default Ember.Component.extend({

  nagios: Ember.inject.service(),

  dateDriftSeconds: null,

  dateDrift: 0,

  didInsertElement: function() {
    Ember.run.next(() => {
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

    Ember.run.later(function() {
      nagios.startTimer();
      that.set('timerForDateDrift', timerForDateDrift);
    }, 1000);
  },

  willDestroyElement: function() {
    this.get('nagios').stopTimer();
    clearInterval(this.get('timerForDateDrift'));
  },

  connectionStatusClass: Ember.computed('nagios.connectionStatus', function() {
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
