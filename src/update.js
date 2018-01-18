import Get from 'lodash/get';
import Set from 'lodash/set';
import UnSet from 'lodash/unset';
import PullAt from 'lodash/pullAt';
import Merge from 'lodash/merge';
import IsString from 'lodash/isString';

import { UpdateReference, GetSection, ApplyData } from './common';

function _getPathParts(path) {
    const index = path.lastIndexOf('.');

    return {
        parent: path.slice(0, index),
        last: path.slice(index + 1)
    };
}

function _pathedUpdate(newValue, path, value, perform) {
    if (!IsString(path)) {
        throw new Error('Invalid Value: "data.path" parameter must be a string.');
    }

    if (perform === 'set') {
        return Set(newValue, path, value);
    } else if (perform === 'unset') {
        return UnSet(newValue, path);
    } else if (perform === 'pull') {
        const pathParts = _getPathParts(path);
        const parent = Get(newValue, pathParts.parent);

        PullAt(parent, pathParts.last);

        return newValue;
    } else if (perform === 'merge') {
        const subTarget = Get(newValue, path);

        if (subTarget != null) {
            Merge(subTarget, value);

            return newValue;
        }

        return Set(newValue, path, value);
    }

    throw new Error('Invalid Value: "perform" parameter must be (undefined | null | "replace" | "merge" | "set" | "unset")');
}

export default function Update(source, parameters) {
    const {
        section, uuid, data, perform, ref, bind
    } = parameters;

    const sectionBody = GetSection(source, '_body', section);

    if (sectionBody == null) {
        throw new Error(`Section "${section}" does not exist`);
    }

    const dataSection = sectionBody._.data;

    const target = dataSection[uuid];

    if (target == null) {
        throw new Error('Target does not exist.');
    }

    const refs = source.get('_refs').toJS();

    UpdateReference(refs, target._ref, ref);

    const currentSource = source.set('_refs', refs);

    if (perform == null || perform === 'replace') {
        target._value = data != null ? data : null;
    } else {
        target._value = _pathedUpdate(target._value, data.path, data.value, perform);
    }

    if (ref !== undefined) {
        target._ref = ref;
    }

    return {
        source: ApplyData(currentSource, section, uuid, target),
        parameters: {
            section,
            uuid,
            data,
            bind: bind !== undefined ? bind === true : undefined
        }
    };
}
