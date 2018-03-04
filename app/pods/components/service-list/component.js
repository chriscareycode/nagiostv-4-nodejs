import Ember from 'ember';

export default Ember.Component.extend({

  nagios: Ember.inject.service(),

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
