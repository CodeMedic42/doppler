import { GetSection, FindTarget, ApplySection } from './common';

export default function _move(source, parameters) {
    const { section, pull, put } = parameters;

    const sectionBody = GetSection(source, '_body', section);

    if (sectionBody == null) {
        throw new Error(`Section "${section}" does not exist`);
    }

    const finalLocation = put[put.length - 1];

    const putResult = FindTarget(sectionBody._.layout, put, true, this.correctErrors);
    const pullResult = FindTarget(sectionBody._.layout, pull, false, this.correctErrors);

    let targetGroups = null;

    if (putResult.parent == null) {
        targetGroups = sectionBody._.layout;
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

    const lastPullNode = pullResult.path[pullResult.path.length - 1];
    const lastPullGroup = lastPullNode.group == null ? '_' : lastPullNode.group;
    const lastPullIndex = lastPullNode.index;

    // Modify the _Document
    let removed = null;

    if (pullResult.parent[lastPullGroup].length <= 1) {
        removed = pullResult.parent[lastPullGroup][0];

        delete pullResult.parent[lastPullGroup];
    } else {
        // Remove from layout
        removed = pullResult.parent[lastPullGroup].splice(lastPullIndex, 1)[0];
    }

    const finalGroup = finalLocation.group == null ? '_' : finalLocation.group;
    let targetGroup = targetGroups[finalGroup];

    if (targetGroup == null) {
        targetGroup = [];

        targetGroups[finalGroup] = targetGroup;
    }

    targetGroup.splice(finalLocation.index, 0, removed);

    putResult.path.push({
        index: finalLocation.index,
        group: finalGroup
    });

    return {
        source: ApplySection(source, '_body', section, sectionBody),
        parameters: {
            section,
            put: putResult.path,
            pull: pullResult.path
        }
    };
}
