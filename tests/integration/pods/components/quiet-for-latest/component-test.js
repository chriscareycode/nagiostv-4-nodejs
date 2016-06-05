import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('quiet-for-latest', 'Integration | Component | quiet for latest', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{quiet-for-latest}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#quiet-for-latest}}
      template block text
    {{/quiet-for-latest}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
