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

  happyClasses: ['flynn1', 'flynn6', 'flynn11'],
  angryClasses: ['flynn2', 'flynn3', 'flynn7', 'flynn8', 'flynn12', 'flynn13', 'flynn16', 'flynn17', 'flynn18', 'flynn19'],
  bloodyClasses: ['flynn4', 'flynn5', 'flynn9', 'flynn10', 'flynn14', 'flynn15', 'flynn24', 'flynn25'],

  flynnClass: Ember.computed('howManyDown', 'timerFired', function() {
    const howManyDown = this.get('howManyDown');
    console.log('howManyDown: ' + howManyDown);

    let classes;
    let flynnClass;
    if (howManyDown === 0) {
      classes = this.get('happyClasses');
    } else if (howManyDown < 4) {
      classes = this.get('angryClasses');
    } else {
      classes = this.get('bloodyClasses');
    }
    const item = classes[Math.floor(Math.random()*classes.length)];
    flynnClass = 'flynn ' + item;
    return flynnClass;
  })

});
