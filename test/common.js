import CloneDeep from 'lodash/cloneDeep';

export function addGroup(arr) {
    if (arr == null) {
        return;
    }

    for (let counter = 0; counter < arr.length; counter += 1) {
        const item = arr[counter];

        if (item.group == null) {
            item.group = '_';
        }
    }
}

export function normalizeParameters(parameters) {
    const newParameters = CloneDeep(parameters);

    addGroup(newParameters.put);
    addGroup(newParameters.pull);

    return newParameters;
}
