import { helper as buildHelper } from '@ember/component/helper';
import moment from 'moment';

export default buildHelper(function([date]) {
  var m = moment(date);
  return m.format('MMM D YYYY, hh:mm:ss A');
});
