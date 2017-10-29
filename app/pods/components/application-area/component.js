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

  startTheTimer: function() {

  },

  timerFired: function() {
    const dateLastUpdate = this.get('nagios.dateLastUpdate');
    const dateDrift = new Date().getTime() - dateLastUpdate;
    this.set('dateDrift', dateDrift);
  },

  atLeastOneServiceDownOrFlapping: Ember.computed('nagios.dateLastUpdate', function() {
    let servicelist = this.get('nagios.servicelist');
    let onedown = false;
    //console.log('servicelist', servicelist);
    for (let hostkey in servicelist) {
      //console.log('each host ', servicelist[hostkey]);
      for (let servicekey in servicelist[hostkey]) {
        //console.log('each service ', servicelist[hostkey][servicekey]);
        if (servicelist[hostkey][servicekey].is_flapping || servicelist[hostkey][servicekey].status !== 2) {
          onedown = true;
        }
      }
    }
    return onedown;
  })

});
