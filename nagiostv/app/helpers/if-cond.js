/*eslint-disable no-console*/
/*jshint ignore: start*/
import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([v1, operator, v2]) {

    switch (operator) {
        case '==':
            return (v1 == v2);
        case '===':
            return (v1 === v2);
        case '!==':
            return (v1 !== v2);
        case '<':
            return (v1 < v2);
        case '<=':
            return (v1 <= v2);
        case '>':
            return (v1 > v2);
        case '>=':
            return (v1 >= v2);
        case '&&':
            return (v1 && v2);
        case '||':
            return (v1 || v2);
        default:
            console.log('ERROR: if-cond - Unknown operator '+operator);
            return null;
    }
});
