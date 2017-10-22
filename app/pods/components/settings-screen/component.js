import Ember from 'ember';

export default Ember.Component.extend({

  nagios: Ember.inject.service(),

  divHandle: null,
  isSettingsOpen: false,
  isAnimating: false,

  isSettingUsernamePassword: false,

  actions: {
    openAction: function() {
      this.openMe();

    },

    saveAction: function() {
      // TODO: actually save somewhere
      const nagios = this.get('nagios');
      nagios.saveLocalSettings(); // save local settings
      nagios.saveNodeSettings(); // save node settings

      this.send('closeAction');
    },

    closeAction: function() {
      let animation = 'slideOutUp';
      let ss = this.get('divHandle').children('.settings-screen');
      this.set('isAnimating', true);
      ss.addClass('animated '+animation);
      ss.on('animationend', () => {
        this.set('isAnimating', false);
        ss.addClass('display-none');
        ss.removeClass('animated '+animation);
        ss.off();
        this.set('isSettingsOpen', false);
      });
    }
  },

  didInsertElement: function() {
    // setTimeout(() => {
    //   // set the handle
    //   this.set('divHandle', this.$());
    //   // open the settings screen
    //   this.openMe();
    // }, 100);
  },

  openMe: function() {
    let animation = 'slideInDown';
    let ss = this.get('divHandle').children('.settings-screen');
    ss.removeClass('display-none');
    this.set('isAnimating', true);
    ss.addClass('animated '+animation);
    ss.on('animationend', () => {
      this.set('isAnimating', false);
      ss.removeClass('animated '+animation);
      ss.off();
      this.set('isSettingsOpen', true);
    });
  }

});
