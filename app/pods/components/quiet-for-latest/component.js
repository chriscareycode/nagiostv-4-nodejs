import Ember from 'ember';

export default Ember.Component.extend({

  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,

  calculateQuietFor: Ember.computed('updateTrigger', function() {

    let date_future = this.get('timestamp');
    let index = this.get('index');
    let notificationlist = this.get('notificationlist');
    let date_now;
    if (index === 0) {
      date_now = new Date().getTime();
    } else {
      date_now = notificationlist[index-1].timestamp;
    }

    // calculate total_minutes
    var diff = date_now - date_future;
    var total_minutes = (diff/(60*1000)).toFixed(0);

    // calculate days, hours, minutes, seconds
    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = (delta % 60).toFixed(0);  // in theory the modulus is not required

    //let diff = previousTimestamp - timestamp;
    //return diff;

    this.set('total_minutes', total_minutes);

    this.set('days', days);
    this.set('hours', hours);
    this.set('minutes', minutes);
    this.set('seconds', seconds);

    return total_minutes;

  })

});
