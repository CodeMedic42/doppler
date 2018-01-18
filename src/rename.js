import Merge from 'lodash/merge';
import { fromJS } from 'immutable';

export default function _rename(source, parameters) {
    const { data } = parameters;

    const head = source.get('_head').toJS();

    Merge(head, data);

    return {
        source: source.set('_head', fromJS(head)),
        parameters: {
            data
        }
    };
}
