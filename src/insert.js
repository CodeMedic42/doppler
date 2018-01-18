import IsString from 'lodash/isString';
import IsArray from 'lodash/isArray';
import UuidV4 from 'uuid/v4';

import { UpdateReference, GetSection, FindTarget, ApplySection } from './common';

function _insertData(section, uuid, nodeValue, reference, bind) {
    const { data } = section._;

    if (data[uuid] != null) {
        throw new Error('Existing data found assigned to this id');
    }

    const nodeData = {
        _value: nodeValue != null ? nodeValue : null,
        _detached: true,
        _bound: bind === true
    };

    if (reference != null) {
        nodeData._ref = reference;
    }

    data[uuid] = nodeData;

    return uuid;
}

function _insertDataAtLocation(section, put, data, reference, bind) {
    const finalLocation = put[put.length - 1];

    const layoutSection = section._.layout;
    const dataSection = section._.data;

    if (finalLocation.uuid != null && dataSection[finalLocation.uuid] != null) {
        throw new Error('Existing data found assigned to this id');
    }

    const putResult = FindTarget(layoutSection, put, true, this.correctErrors);

    let targetGroups = null;

    if (putResult.parent == null) {
        targetGroups = layoutSection;
    } else {
        const lastPutNode = putResult.path[putResult.path.length - 1];
        const lastPutGroup = lastPutNode.group == null ? '_' : lastPutNode.group;
        const lastPutIndex = lastPutNode.index;

        const target = putResult.parent[lastPutGroup][lastPutIndex];

        if (target.groups == null) {
            target.groups = {};
        }

        targetGroups = target.groups;
    }

    const finalGroup = finalLocation.group == null ? '_' : finalLocation.group;
    let targetGroup = targetGroups[finalGroup];

    if (targetGroup == null) {
        targetGroup = [];

        targetGroups[finalGroup] = targetGroup;
    }

    const uuid = finalLocation.uuid == null ? UuidV4() : finalLocation.uuid;

    // Modify the _Document
    targetGroup.splice(finalLocation.index, 0, {
        uuid
    });

    dataSection[uuid] = {
        _value: data != null ? data : null,
        _detached: false,
        _bound: bind === true
    };

    if (reference != null) {
        dataSection[uuid]._ref = reference;
    }

    putResult.path.push({
        index: finalLocation.index,
        uuid,
        group: finalGroup
    });

    return putResult.path;
}

export default function _insert(source, parameters) {
    const {
        section, put, data, bind, ref
    } = parameters;

    const refs = source.get('_refs').toJS();

    UpdateReference(refs, undefined, ref);

    const currentSource = source.set('_refs', refs);

    let sectionBody = GetSection(source, '_body', section);

    if (sectionBody == null) {
        sectionBody = {
            _: {
                layout: {},
                data: {}
            }
        };
    }

    let result = null;

    if (IsString(put)) {
        result = _insertData.call(this, sectionBody, put, data, ref, bind);
    } else if (IsArray(put)) {
        result = _insertDataAtLocation.call(this, sectionBody, put, data, ref, bind);
    } else {
        throw new Error('Argument Error: Put must be a string or an array.');
    }

    return {
        source: ApplySection(currentSource, '_body', section, sectionBody),
        parameters: {
            section,
            put: result,
            data,
            bind: bind === true
        }
    };
}
