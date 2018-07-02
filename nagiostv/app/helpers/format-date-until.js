/*globals moment */

import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([date]) {
  var m = moment(date);
  const diff = m.diff(moment());
  const tempTime = moment.duration(diff);

  let ret = '';
  if (tempTime.hours()) { ret += tempTime.hours() + 'h '}
  if (tempTime.minutes()) { ret += tempTime.minutes() + 'm '}

  return ret + tempTime.seconds() + 's';
});
