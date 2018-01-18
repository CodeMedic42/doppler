import IsString from 'lodash/isString';
import Split from 'lodash/split';
import ForEach from 'lodash/forEach';
import IsPlainObject from 'lodash/isPlainObject';
import Keys from 'lodash/keys';
import IsArray from 'lodash/isArray';
import { fromJS } from 'immutable';

export function ValidateSectionPath(sectionDef) {
    if (!IsString(sectionDef)) {
        throw new Error('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
    }

    if (sectionDef.match(/^_$|^_\..*$|^.*\._$|^.*\._\..*$/) != null) {
        throw new Error('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
    }

    return Split(sectionDef, '.');
}

function _findInRecursive(layout, targetUuid, ignoreUuid) {
    let counter = 0;

    const groupIds = Keys(layout);

    for (let groupCounter = 0; groupCounter < groupIds.length; groupCounter += 1) {
        const groupId = groupIds[groupCounter];
        const group = layout[groupId];

        if (group != null) {
            while (counter < group.length) {
                if (group[counter].uuid !== ignoreUuid) {
                    if (group[counter].uuid === targetUuid) {
                        // THERE IT IS!!!!
                        this.push({
                            uuid: targetUuid,
                            group: groupId,
                            index: counter
                        });

                        return layout;
                    }

                    let found = null;

                    if (group[counter].groups != null) {
                        found = _findInRecursive.call(this, group[counter].groups, targetUuid, ignoreUuid);
                    }

                    if (found != null) {
                        this.unshift({
                            uuid: layout[counter].uuid,
                            group: groupId,
                            index: counter
                        });

                        return found;
                    }
                }

                // keep looking
                counter += 1;
            }
        }
    }

    // not found
    return null;
}

function _findIn(layout, targetUuid, ignoreUuid) {
    const finalPath = [];

    const found = _findInRecursive.call(finalPath, layout, targetUuid, ignoreUuid);

    return found == null ? null : {
        item: found,
        path: finalPath
    };
}

function _findTargetItem(root, current, node, currentId, errorCorrect) {
    let { index } = node;
    const groupId = node.group == null ? '_' : node.group;
    const group = current[groupId];

    if (group != null && group.length > 0) {
        if (index < group.length) {
            const possibleTarget = group[index];

            if (possibleTarget != null && possibleTarget.uuid === node.uuid) {
                // easy
                return {
                    item: possibleTarget.groups,
                    path: {
                        uuid: node.uuid,
                        index,
                        group: groupId
                    },
                    reset: false
                };
            }
        } else {
            // The index is greater than the length
            // set the index to the length and then the next part will check.
            index = current.length;
        }

        if (!errorCorrect) {
            throw new Error('Unable to find targetItem');
        }

        // Check before index
        if (index > 0) {
            let counter = 0;

            while (counter < index) {
                const possibleBeforeTarget = group[counter];

                if (possibleBeforeTarget.uuid === node.uuid) {
                    // easy
                    return {
                        item: possibleBeforeTarget.groups,
                        path: {
                            uuid: node.uuid,
                            index: counter,
                            group: groupId
                        },
                        reset: false
                    };
                }

                counter += 1;
            }
        }

        // Check after index
        if (index < group.length - 1) {
            let counter = index + 1;

            while (counter < group.length) {
                const possibleAfterTarget = group[counter];

                if (possibleAfterTarget.uuid === node.uuid) {
                    // easy
                    return {
                        item: possibleAfterTarget.groups,
                        path: {
                            uuid: node.uuid,
                            index: counter,
                            group: groupId
                        },
                        reset: false
                    };
                }

                counter += 1;
            }
        }
    } else if (!errorCorrect) {
        throw new Error('Unable to find targetItem');
    }

    // Crap it was not found, need to check the entire tree.
    const rootTarget = _findIn(root, node.uuid, currentId);

    if (rootTarget != null) {
        return {
            item: rootTarget.item,
            path: rootTarget.path,
            reset: true
        };
    }

    // DAMN it was not found anywhere.
    throw new Error('Unable to find targetItem (Checked the whole tree)');
}

function _removeReference(refs, uuid) {
    const ref = refs[uuid];

    if (ref == null) {
        throw new Error(`Internal Error: Reference ${uuid} does not exist`);
    }

    if (ref.count === 1) {
        // eslint-disable-next-line no-param-reassign
        delete refs[uuid];
    } else {
        ref.count -= 1;
    }
}

function _addReference(refs, type, uuid) {
    const ref = refs[uuid];

    if (ref == null) {
        // eslint-disable-next-line no-param-reassign
        refs[uuid] = {
            count: 1,
            type
        };
    } else if (ref.type !== type) {
        throw new Error(`Argument Error: Existing reference type of "${ref.type}" does not match type of "${type}"`);
    } else {
        ref.count += 1;
    }
}

function _validateRef(reference) {
    if (!IsPlainObject(reference)) {
        throw new Error('Argument Error: _ref must an object when defined');
    }

    if (!IsString(reference.uuid)) {
        throw new Error('Argument Error: _ref.uuid must be a string greater than zero characters');
    }

    if (!IsString(reference.type)) {
        throw new Error('Argument Error: _ref.type must be a string greater than zero characters');
    }
}

export function UpdateReference(refs, existingRef, newRef) {
    if (refs == null) {
        throw new Error('Internal Error: Refs cannot be nil');
    }

    if (existingRef == null && newRef == null) {
        return null;
    }

    if (newRef == null) {
        // We are removing a reference
        _removeReference(refs, existingRef.uuid);
    } else {
        _validateRef(newRef);

        if (existingRef == null) {
            // We are adding a reference
            _addReference(refs, newRef.type, newRef.uuid);
        } else if (existingRef.uuid !== newRef.uuid || existingRef.type !== newRef.type) {
            // We are changing a reference
            _removeReference(refs, existingRef.uuid);
            _addReference(refs, newRef.type, newRef.uuid);
        }
    }

    return refs;
}

export function GetSection(source, part, sectionDef) {
    if (source == null) {
        throw new Error('Internal Error: Source cannot be nil');
    }

    if (part == null) {
        throw new Error('Internal Error: Part cannot be nil');
    }

    if (sectionDef == null) {
        const section = source.get(part);

        if (section == null) {
            return null;
        }

        return section.toJS();
    }

    ValidateSectionPath(sectionDef);

    const path = Split(sectionDef, '.');

    const sectionBodyImm = source.getIn([part, ...path]);

    let sectionBody = null;

    if (sectionBodyImm != null) {
        sectionBody = sectionBodyImm.toJS();
    }

    return sectionBody;
}

export function FindTarget(layout, path, ignorelast, errorCorrect) {
    if (!IsArray(path)) {
        throw new Error('Argument Error: Layout selection must define at least one target item');
    } else if (path.length <= 0) {
        throw new Error('Argument Error: Layout selection must define at least one target item');
    }

    let final = [];
    const length = ignorelast ? path.length - 1 : path.length;
    let counter = 0;
    let current = layout;
    let previous = null;
    let currentId = null;

    while (counter < length) {
        const node = path[counter];

        const result = _findTargetItem(layout, current, node, currentId, errorCorrect);

        if (result.reset) {
            final = result.path;
            current = result.item;
        } else {
            final.push(result.path);
        }

        previous = current;
        const lastNode = final[final.length - 1];
        const lastGroup = lastNode.group == null ? '_' : lastNode.group;
        const lastIndex = lastNode.index;
        const next = current[lastGroup][lastIndex];
        current = next.groups;
        currentId = next.uuid;

        counter += 1;
    }

    return {
        parent: previous,
        path: final
    };
}

export function DeleteSection(source, part, sectionDef) {
    if (source == null) {
        throw new Error('Internal Error: Source cannot be nil');
    }

    if (part == null) {
        throw new Error('Internal Error: Part cannot be nil');
    }

    if (sectionDef == null || sectionDef === '') {
        return source.set(part, {});
    }

    ValidateSectionPath(sectionDef);

    const path = Split(sectionDef, '.');

    return source.deleteIn([part, ...path]);
}

export function ApplySection(source, part, sectionDef, section) {
    const sectionParts = [part];

    if (sectionDef != null) {
        const path = Split(sectionDef, '.');

        sectionParts.push(...path);
    }

    return source.setIn(sectionParts, fromJS(section));
}

export function ApplyData(source, sectionDef, uuid, data) {
    const sectionParts = ['_body'];

    if (sectionDef != null) {
        const path = Split(sectionDef, '.');

        sectionParts.push(...path);
    }

    sectionParts.push('_', 'data', uuid);

    return source.setIn(sectionParts, fromJS(data));
}

export function ClearSectionRefs(sectionBody, refs) {
    const sectionMeta = sectionBody._;

    if (sectionMeta != null) {
        ForEach(sectionMeta.data, (data) => {
            UpdateReference(refs, data._ref, null);
        });
    }

    // eslint-disable-next-line no-param-reassign
    delete sectionBody._;

    ForEach(sectionBody, (sectionChild) => {
        ClearSectionRefs(sectionChild, refs);
    });
}
