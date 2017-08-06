import Ember from 'ember';

export default Ember.Component.extend({

  // when in happy mode, start a timer to change face every n seconds

  // when in sad mode, show a sad face

  // we will go with three modes for now - happy, angry, and fucked up

  // based upon the amount of items which are down

  howManyDown: 0,

  timerHandle: null,
  timerFired: 0,

  animateInterval: 4 * 1000,

  didInsertElement: function() {
    const animateInterval = this.get('animateInterval');
    const timerHandle = setInterval(() => {
      this.set('timerFired', new Date().getTime());
    }, animateInterval);
    Ember.run.next(() => {
      this.set('timerHandle', timerHandle);
    });
  },

  willDestroyElement: function() {
    const timerHandle = this.get('timerHandle');
    if (timerHandle) {
      clearInterval(timerHandle);
    }
  },

  // howManyDownWatcher: Ember.observer('howManyDown', function() {
  //   const howManyDown = this.get('howManyDown');
  //   console.log('howManyDown: ' + howManyDown);
  // }),

  happyClasses: ['flynn1', 'flynn6', 'flynn11'],
  angryClasses: ['flynn2', 'flynn3', 'flynn7', 'flynn8', 'flynn12', 'flynn13', 'flynn16', 'flynn17', 'flynn18'],
  bloodyClasses: ['flynn4', 'flynn5', 'flynn9', 'flynn10', 'flynn14', 'flynn15', 'flynn19', 'flynn24', 'flynn25'],

  flynnClass: Ember.computed('howManyDown', 'timerFired', function() {
    const howManyDown = this.get('howManyDown');
    console.log('howManyDown: ' + howManyDown);

    let flynnClass;
    if (howManyDown === 0) {
      const happyClasses = this.get('happyClasses');
      const item = happyClasses[Math.floor(Math.random()*happyClasses.length)];
      flynnClass = 'flynn ' + item;
    } else if (howManyDown < 4) {
      const angryClasses = this.get('angryClasses');
      const item = angryClasses[Math.floor(Math.random()*angryClasses.length)];
      flynnClass = 'flynn ' + item;
    } else {
      const bloodyClasses = this.get('bloodyClasses');
      const item = bloodyClasses[Math.floor(Math.random()*bloodyClasses.length)];
      flynnClass = 'flynn ' + item;
    }
    return flynnClass;
  })

});
