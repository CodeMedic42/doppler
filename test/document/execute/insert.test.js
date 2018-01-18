/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import UuidV4 from 'uuid/v4';
import CloneDeep from 'lodash/cloneDeep';
import { normalizeParameters } from '../../common';
import Document from '../../../src/document';
import Data from '../../data/data.json';

Chai.use(DirtyChai);

const expect = Chai.expect;

function changeToSectionA(data) {
    // eslint-disable-next-line no-param-reassign
    data._body.sectionA = {
        _: data._body._
    };

    // eslint-disable-next-line no-param-reassign
    data._issues.sectionA = {
        _: data._issues._
    };

    // eslint-disable-next-line no-param-reassign
    delete data._body._;
    // eslint-disable-next-line no-param-reassign
    delete data._issues._;
}

describe('Insert :', () => {
    describe('Section Not Defined:', () => {
        describe('Correct Error :', () => {
            it('base', () => {
                const data = CloneDeep(Data);

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                const doc = document.toJs();

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index +1', () => {
                const data = CloneDeep(Data);

                const extraUuid = UuidV4();

                data._body._.layout._.unshift({
                    uuid: extraUuid
                });

                data._body._.data[extraUuid] = {
                    type: 'text'
                };

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                parameters.put[0].index = 3;

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[3].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index -1', () => {
                const data = CloneDeep(Data);

                const removedItem = data._body._.layout._.shift();

                delete data._body._.data[removedItem.uuid];

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                parameters.put[0].index = 1;

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[1].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('in different location altogether', () => {
                const data = CloneDeep(Data);

                const movedItem = data._body._.layout._[2].groups._.pop();
                data._body._.layout._.push(movedItem);
                data._body._.data[movedItem.uuid].name = 'moved';

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[1].uuid;
                delete result.put[1].uuid;

                expect(result).to.deep.equal({
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 8,
                        group: '_',
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        group: '_',
                        index: 0
                    }],
                    data: parameters.data,
                    bind: false
                });

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[8].groups._[0].uuid).to.equal(createdUuid);
            });

            it('not found', () => {
                const data = CloneDeep(Data);

                const movedItem = data._body._.layout._[2].groups._.pop();
                delete data._body._.data[movedItem.uuid];

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect().fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem (Checked the whole tree)');
                }
            });
        });

        describe('Do Not Correct Error :', () => {
            it('base', () => {
                const data = CloneDeep(Data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index +1', () => {
                const data = CloneDeep(Data);

                const extraUuid = UuidV4();

                data._body._.layout._.unshift({
                    uuid: extraUuid
                });

                data._body._.data[extraUuid] = {
                    type: 'text'
                };

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('index -1', () => {
                const data = CloneDeep(Data);

                const removedItem = data._body._.layout._.shift();

                delete data._body._.data[removedItem.uuid];

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('in different location altogether', () => {
                const data = CloneDeep(Data);

                const movedItem = data._body._.layout._[2].groups._.pop();
                data._body._.layout._.push(movedItem);
                data._body._.data[movedItem.uuid].name = 'moved';

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('not found', () => {
                const data = CloneDeep(Data);

                const movedItem = data._body._.layout._[2].groups._.pop();
                delete data._body._.data[movedItem.uuid];

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('insert at root', () => {
                const data = CloneDeep(Data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[0].uuid;
                delete result.put[0].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body._.layout._[0].uuid).to.equal(createdUuid);
            });

            it('already exists', () => {
                const data = CloneDeep(Data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: null,
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0,
                        uuis: '8823CFCE7D4645C68991332091C1A05C'
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);
                } catch (err) {
                    expect(err.message).to.equal('Existing data found assigned to this id');
                }
            });

            describe('With reference change :', () => {
                it('new reference', () => {
                    const data = CloneDeep(Data);

                    const document = Document.fromJs(data, false);

                    const parameters = {
                        documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                        documentType: 'entity',
                        section: null,
                        put: [{
                            index: 2,
                            uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                        }, {
                            index: 0,
                            uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                        }, {
                            index: 0
                        }],
                        data: {
                            type: 'text',
                            _key: 'foo'
                        },
                        ref: {
                            uuid: 'foo',
                            type: 'entity'
                        },
                        bind: false
                    };

                    const result = document.execute('insert', parameters);

                    const createdUuid = result.put[2].uuid;
                    delete result.put[2].uuid;

                    expect(result).to.deep.equal(normalizeParameters(parameters));

                    const doc = document.toJs();

                    const expectedData = {
                        _value: parameters.data,
                        _detached: false,
                        _bound: false,
                        _ref: {
                            uuid: 'foo',
                            type: 'entity'
                        }
                    };

                    expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                    expect(doc._body._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);

                    expect(doc._refs.foo).to.deep.equal({
                        count: 1,
                        type: 'entity'
                    });
                });

                it('existing reference', () => {
                    const data = CloneDeep(Data);

                    const document = Document.fromJs(data, false);

                    const parameters = {
                        documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                        documentType: 'entity',
                        section: null,
                        put: [{
                            index: 2,
                            uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                        }, {
                            index: 0,
                            uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                        }, {
                            index: 0
                        }],
                        data: {
                            type: 'text',
                            _key: 'foo'
                        },
                        ref: {
                            uuid: '4ABE4F6230F148B3BAB987715B49DE22',
                            type: 'entity'
                        },
                        bind: false
                    };

                    const result = document.execute('insert', parameters);

                    const createdUuid = result.put[2].uuid;
                    delete result.put[2].uuid;

                    expect(result).to.deep.equal(normalizeParameters(parameters));

                    const doc = document.toJs();

                    const expectedData = {
                        _value: parameters.data,
                        _detached: false,
                        _bound: false,
                        _ref: {
                            uuid: '4ABE4F6230F148B3BAB987715B49DE22',
                            type: 'entity'
                        }
                    };

                    expect(doc._body._.data[createdUuid]).to.deep.equal(expectedData);
                    expect(doc._body._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);

                    expect(doc._refs['4ABE4F6230F148B3BAB987715B49DE22']).to.deep.equal({
                        count: 3,
                        type: 'entity'
                    });
                });
            });
        });
    });

    describe('Defined Section :', () => {
        describe('Correct Error :', () => {
            // beforeEach(function beforeSetup() {
            //     this.document = Document.fromJs(data, true);
            //
            //     changeToSectionA(this.document);
            // });

            it('base', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index +1', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const extraUuid = UuidV4();

                data._body.sectionA._.layout._.unshift({
                    uuid: extraUuid
                });

                data._body.sectionA._.data[extraUuid] = {
                    type: 'text'
                };

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                parameters.put[0].index = 3;

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[3].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index -1', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const removedItem = data._body.sectionA._.layout._.shift();

                delete data._body.sectionA._.data[removedItem.uuid];

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                parameters.put[0].index = 1;

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[1].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('in different location altogether', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const movedItem = data._body.sectionA._.layout._[2].groups._.pop();
                data._body.sectionA._.layout._.push(movedItem);
                data._body.sectionA._.data[movedItem.uuid].name = 'moved';

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[1].uuid;
                delete result.put[1].uuid;

                expect(result).to.deep.equal({
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 8,
                        group: '_',
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        group: '_',
                        index: 0
                    }],
                    data: parameters.data,
                    bind: false
                });

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[8].groups._[0].uuid).to.equal(createdUuid);
            });

            it('not found', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const movedItem = data._body.sectionA._.layout._[2].groups._.pop();
                delete data._body.sectionA._.data[movedItem.uuid];

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem (Checked the whole tree)');
                }
            });
        });

        describe('Do Not Correct Error :', () => {
            it('base', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[2].uuid;
                delete result.put[2].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);
            });

            it('index +1', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const extraUuid = UuidV4();

                data._body.sectionA._.layout._.unshift({
                    uuid: extraUuid
                });

                data._body.sectionA._.data[extraUuid] = {
                    type: 'text'
                };

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('index -1', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const removedItem = data._body.sectionA._.layout._.shift();

                delete data._body.sectionA._.data[removedItem.uuid];

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('in different location altogether', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const movedItem = data._body.sectionA._.layout._[2].groups._.pop();
                data._body.sectionA._.layout._.push(movedItem);
                data._body.sectionA._.data[movedItem.uuid].name = 'moved';

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('not found', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const movedItem = data._body.sectionA._.layout._[2].groups._.pop();
                delete data._body.sectionA._.data[movedItem.uuid];

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    }
                };

                try {
                    document.execute('insert', parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Unable to find targetItem');
                }
            });

            it('insert at root', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    put: [{
                        index: 0
                    }],
                    data: {
                        type: 'text',
                        _key: 'foo'
                    },
                    bind: false
                };

                const result = document.execute('insert', parameters);

                const createdUuid = result.put[0].uuid;
                delete result.put[0].uuid;

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const expectedData = {
                    _value: parameters.data,
                    _detached: false,
                    _bound: false
                };

                expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                expect(doc._body.sectionA._.layout._[0].uuid).to.equal(createdUuid);
            });

            describe('With reference change :', () => {
                it('new reference', () => {
                    const data = CloneDeep(Data);

                    changeToSectionA(data);

                    const document = Document.fromJs(data, false);

                    const parameters = {
                        documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                        documentType: 'entity',
                        section: 'sectionA',
                        put: [{
                            index: 2,
                            uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                        }, {
                            index: 0,
                            uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                        }, {
                            index: 0
                        }],
                        data: {
                            type: 'text',
                            _key: 'foo'
                        },
                        ref: {
                            uuid: 'foo',
                            type: 'entity'
                        },
                        bind: false
                    };

                    const result = document.execute('insert', parameters);

                    const createdUuid = result.put[2].uuid;
                    delete result.put[2].uuid;

                    expect(result).to.deep.equal(normalizeParameters(parameters));

                    const doc = document.toJs();

                    const expectedData = {
                        _value: parameters.data,
                        _detached: false,
                        _bound: false,
                        _ref: {
                            uuid: 'foo',
                            type: 'entity'
                        }
                    };

                    expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                    expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);

                    expect(doc._refs.foo).to.deep.equal({
                        count: 1,
                        type: 'entity'
                    });
                });

                it('existing reference', () => {
                    const data = CloneDeep(Data);

                    changeToSectionA(data);

                    const document = Document.fromJs(data, false);

                    const parameters = {
                        documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                        documentType: 'entity',
                        section: 'sectionA',
                        put: [{
                            index: 2,
                            uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                        }, {
                            index: 0,
                            uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                        }, {
                            index: 0
                        }],
                        data: {
                            type: 'text',
                            _key: 'foo'
                        },
                        ref: {
                            uuid: '4ABE4F6230F148B3BAB987715B49DE22',
                            type: 'entity'
                        },
                        bind: false
                    };

                    const result = document.execute('insert', parameters);

                    const createdUuid = result.put[2].uuid;
                    delete result.put[2].uuid;

                    expect(result).to.deep.equal(normalizeParameters(parameters));

                    const doc = document.toJs();

                    const expectedData = {
                        _value: parameters.data,
                        _detached: false,
                        _bound: false,
                        _ref: {
                            uuid: '4ABE4F6230F148B3BAB987715B49DE22',
                            type: 'entity'
                        }
                    };

                    expect(doc._body.sectionA._.data[createdUuid]).to.deep.equal(expectedData);
                    expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal(createdUuid);

                    expect(doc._refs['4ABE4F6230F148B3BAB987715B49DE22']).to.deep.equal({
                        count: 3,
                        type: 'entity'
                    });
                });
            });
        });
    });

    describe('Section does not exist', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'foo.bar',
                put: [{
                    index: 0
                }],
                data: {
                    type: 'text',
                    _key: 'foo'
                },
                bind: false
            };

            const result = document.execute('insert', parameters);

            const createdUuid = result.put[0].uuid;
            delete result.put[0].uuid;

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            const expectedData = {
                _value: parameters.data,
                _detached: false,
                _bound: false
            };

            expect(doc._body.foo.bar._.data[createdUuid]).to.deep.equal(expectedData);
            expect(doc._body.foo.bar._.layout._[0].uuid).to.equal(createdUuid);
        });
    });

    describe('Detatched', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: null,
                put: 'newData',
                data: {
                    type: 'text',
                    _key: 'foo'
                },
                bind: false
            };

            const result = document.execute('insert', parameters);

            expect(result).to.deep.equal(parameters);

            const doc = document.toJs();

            const expectedData = {
                _value: parameters.data,
                _detached: true,
                _bound: false
            };

            expect(doc._body._.data.newData).to.deep.equal(expectedData);
        });

        it('already exists', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: null,
                put: '152488CC33434A8C9CACBC2E06A7E535',
                data: {
                    type: 'text',
                    _key: 'foo'
                }
            };

            try {
                document.execute('insert', parameters);
            } catch (err) {
                expect(err.message).to.equal('Existing data found assigned to this id');
            }
        });
    });

    describe('Bound :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: null,
                put: 'newData',
                data: {
                    type: 'text',
                    _key: 'foo'
                },
                bind: true
            };

            const result = document.execute('insert', parameters);

            expect(result).to.deep.equal(parameters);

            const doc = document.toJs();

            const expectedData = {
                _value: parameters.data,
                _detached: true,
                _bound: true
            };

            expect(doc._body._.data.newData).to.deep.equal(expectedData);
        });
    });
});
