import IsArray from 'lodash/isArray';
import ForEach from 'lodash/forEach';
import IsString from 'lodash/isString';
import Keys from 'lodash/keys';
import { fromJS } from 'immutable';

import { FindTarget, GetSection, ApplySection, ClearSectionRefs, UpdateReference, DeleteSection } from './common';

function _cleanNode(sectionBody, issuesBody, refs, node) {
    const nodeData = sectionBody._.data[node.uuid];

    if (nodeData == null) {
        throw new Error(`Node "${node.uuid}" does not exist.`);
    }

    // eslint-disable-next-line
    delete sectionBody._.data[node.uuid];

    UpdateReference(refs, nodeData._ref, null);

    if (issuesBody != null && issuesBody._ != null) {
        // eslint-disable-next-line
        delete issuesBody._[node.uuid];
    }

    if (nodeData._bound) {
        const boundSection = sectionBody[node.uuid];

        if (boundSection != null) {
            ClearSectionRefs(boundSection, refs);
        }

        // eslint-disable-next-line no-param-reassign
        delete sectionBody[node.uuid];

        if (issuesBody != null) {
            // eslint-disable-next-line
            delete issuesBody[node.uuid];
        }
    }

    ForEach(node.groups, (group) => {
        ForEach(group, (groupNode) => {
            _cleanNode(sectionBody, issuesBody, refs, groupNode);
        });
    });
}

function _removeData(sectionBody, issuesBody, refs, uuid) {
    const nodeData = sectionBody._.data[uuid];

    if (nodeData != null) {
        if (nodeData._detached !== true) {
            throw new Error('Target item is attached to layout');
        }
    } else {
        // Nothing to remove
        return null;
    }

    _cleanNode(sectionBody, issuesBody, refs, { uuid });

    return uuid;
}

function _removeDataAtLocation(sectionBody, issuesBody, refs, pull) {
    // Let's check to see if this data even still exists.
    const itemIdToPull = pull[pull.length - 1].uuid;

    const dataSection = sectionBody._.data;
    const target = dataSection[itemIdToPull];

    if (target == null) {
        // Nothing to remove
        return null;
    }

    // ok the data at least exists. Let find it.
    const layoutSection = sectionBody._.layout;

    const result = FindTarget(layoutSection, pull, false, this.correctErrors);

    const lastNode = result.path[result.path.length - 1];
    const lastGroup = lastNode.group == null ? '_' : lastNode.group;
    const lastIndex = lastNode.index;

    let removed = null;

    if (result.parent[lastGroup].length <= 1) {
        removed = result.parent[lastGroup][0];

        delete result.parent[lastGroup];
    } else {
        // Remove from layout
        removed = result.parent[lastGroup].splice(lastIndex, 1)[0];
    }

    // Remove all instances of data.
    _cleanNode(sectionBody, issuesBody, refs, removed);

    return result.path;
}

export default function _remove(source, parameters) {
    const { section, pull } = parameters;

    const sectionBody = GetSection(source, '_body', section);

    if (sectionBody == null || sectionBody._ == null) {
        return null;
    }

    const issuesBody = GetSection(source, '_issues', section);
    const refs = source.get('_refs').toJS();

    let result = null;

    if (IsString(pull)) {
        result = _removeData.call(this, sectionBody, issuesBody, refs, pull);
    } else if (IsArray(pull)) {
        result = _removeDataAtLocation.call(this, sectionBody, issuesBody, refs, pull);
    } else {
        throw new Error('Invalid "pull" parameter');
    }

    if (result == null) {
        return null;
    }

    let updated = source.set('_refs', fromJS(refs));

    if (issuesBody != null) {
        if (Keys(issuesBody).length > 0) {
            updated = ApplySection(updated, '_issues', section, issuesBody);
        } else {
            updated = DeleteSection(updated, '_issues', section);
        }
    }

    return {
        source: ApplySection(updated, '_body', section, sectionBody),
        parameters: {
            section,
            pull: result
        }
    };
}
