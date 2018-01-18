import { fromJS } from 'immutable';
import Split from 'lodash/split';

import { ValidateSectionPath, ClearSectionRefs } from './common';

function _defineSection(source, sectionDef) {
    if (sectionDef == null) {
        throw new Error('Argument Error: Invalid section');
    }

    ValidateSectionPath(sectionDef);

    const sectionPath = ['_body'];

    if (sectionDef.length > 0) {
        sectionPath.push(...Split(sectionDef, '.'));
    }

    if (source.hasIn(sectionPath)) {
        return null;
    }

    return source.setIn(sectionPath, {});
}

function _undefineSection(source, sectionDef) {
    if (sectionDef == null) {
        throw new Error('Argument Error: Invalid section');
    }

    ValidateSectionPath(sectionDef);

    const sectionBodyPath = ['_body'];
    const sectionIssuesPath = ['_issues'];

    if (sectionDef.length > 0) {
        const additionalPath = Split(sectionDef, '.');

        sectionBodyPath.push(...additionalPath);
        sectionIssuesPath.push(...additionalPath);
    }

    const refs = source.get('_refs');
    const sectionImmBody = source.getIn(sectionBodyPath);

    if (sectionImmBody == null) {
        return null;
    }

    ClearSectionRefs(sectionImmBody.toJS(), refs);

    let updated = source.set('_refs', fromJS(refs));

    if (sectionDef === '') {
        updated = updated.set('_body', fromJS({}));
        updated = updated.set('_issues', fromJS({}));
    } else {
        updated = updated.deleteIn(sectionBodyPath);
        updated = updated.deleteIn(sectionIssuesPath);
    }

    return updated;
}

export function Define(source, parameters) {
    const { section } = parameters;

    const result = _defineSection(source, section);

    if (result == null) {
        return null;
    }

    return {
        source: result,
        parameters: {
            section
        }
    };
}

export function Undefine(source, parameters) {
    const { section } = parameters;

    const result = _undefineSection(source, section);

    if (result == null) {
        return null;
    }

    return {
        source: result,
        parameters: {
            section
        }
    };
}
