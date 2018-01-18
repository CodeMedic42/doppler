import IsString from 'lodash/isString';

import { GetSection, ApplySection } from './common';

export default function _issues(source, parameters) {
    const { section, uuid, data } = parameters;

    if (!IsString(uuid)) {
        throw new Error('Argument Error: Uuid must be a string with more than one character');
    } else if (uuid.length <= 0) {
        throw new Error('Argument Error: Uuid must be a string with more than one character');
    }

    const sectionBody = GetSection(source, '_body', section);

    if (sectionBody == null || sectionBody._ == null || sectionBody._.data == null || sectionBody._.data[uuid] == null) {
        throw new Error(`Not Found: Node "${uuid}" does not exist`);
    }

    let issuesBody = GetSection(source, '_issues', section);

    if (issuesBody == null) {
        issuesBody = {
            _: {}
        };
    } else if (issuesBody._ == null) {
        issuesBody._ = {};
    }

    if (data != null) {
        issuesBody._[uuid] = data;
    } else {
        delete issuesBody._[uuid];
    }

    const finalParameters = {
        uuid
    };

    if (section !== undefined) {
        finalParameters.section = section;
    }

    if (data !== undefined) {
        finalParameters.data = data;
    }

    return {
        source: ApplySection(source, '_issues', section, issuesBody),
        parameters: finalParameters
    };
}
