import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([state]) {
  switch(state) {
    case 0:
      return 'SOFT';
    case 1:
      return 'HARD';

  }
  return 'Unknown state '+state;
});
