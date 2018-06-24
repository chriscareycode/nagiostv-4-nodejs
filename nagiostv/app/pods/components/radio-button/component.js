import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'input',
  type: 'radio',
  attributeBindings : [ "name", "type", "value", "checked:checked" ],
  click : function() {
    //console.log('click');
    //console.log(this.$().val());
    let val = this.$().val();
    // handle true and false exception
    if (val === 'true') { val = true; }
    if (val === 'false') { val = false; }

    this.set('selection', val);
  },
  checked : computed('selection', function() {

    let val = this.get('value');
    // handle true and false exception
    if (val === 'true') { val = true; }
    if (val === 'false') { val = false; }
    //console.log('--checked--');
    //console.log(this.get('value'));
    //console.log(this.get('selection'));

    return val === this.get('selection');
  })
});
