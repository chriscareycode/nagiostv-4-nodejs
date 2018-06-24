import Component from '@ember/component';
import { inject as injectService } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

  nagios: injectService(),

  atLeastOneServiceDownOrFlapping: computed('nagios.dateLastUpdate', function() {
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
