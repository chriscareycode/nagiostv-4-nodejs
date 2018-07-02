import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([status]) {
  switch(status) {
    case 1:
      return 'NOT CHECKED';
    case 2:
      return 'OK';
    case 4:
      return 'WARNING';
    case 8:
      return 'UNKNOWN';
    case 16:
      return 'CRITICAL';
  }
  return 'Unknown status '+status;
});
