import Ember from 'ember';

export default Ember.Component.extend({

  // when in happy mode, start a timer to change face every n seconds

  // when in sad mode, show a sad face

  // we will go with three modes for now - happy, angry, and fucked up

  // based upon the amount of items which are down

  howManyDown: 0,

  // didInsertElement: function() {
  // },

  // howManyDownWatcher: Ember.observer('howManyDown', function() {
  //   const howManyDown = this.get('howManyDown');
  //   console.log('howManyDown: ' + howManyDown);
  // }),

  flynnClass: Ember.computed('howManyDown', function() {
    const howManyDown = this.get('howManyDown');
    console.log('howManyDown: ' + howManyDown);

    let flynnClass;
    if (howManyDown === 0) {
      flynnClass = 'flynn flynn1';
    } else if (howManyDown < 4) {
      flynnClass = 'flynn flynn2';
    } else {
      flynnClass = 'flynn flynn24';
    }
    return flynnClass;
  })

});
