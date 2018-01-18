/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import CloneDeep from 'lodash/cloneDeep';
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

describe('Update :', () => {
    describe('Correct Error :', () => {
        it('Can find uuid', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            const result = document.execute('update', parameters);

            expect(result).to.exist();

            expect(result.uuid).to.equal(parameters.uuid);

            const doc = document.toJs();

            const expectedData = {
                _detached: false,
                _bound: false,
                _value: parameters.data
            };

            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.deep.equal(expectedData);
        });

        it('Cannot find uuid', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            delete data._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C'];

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            try {
                document.execute('update', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Target does not exist.');
            }
        });
    });

    describe('Do Not Correct Error :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            const result = document.execute('update', parameters);

            expect(result).to.exist();

            expect(result.uuid).to.equal(parameters.uuid);

            const doc = document.toJs();

            const expectedData = {
                _detached: false,
                _bound: false,
                _value: parameters.data
            };

            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.deep.equal(expectedData);
        });

        it('Can find uuid', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            const result = document.execute('update', parameters);

            expect(result).to.exist();

            expect(result.uuid).to.equal(parameters.uuid);

            const doc = document.toJs();

            const expectedData = {
                _detached: false,
                _bound: false,
                _value: parameters.data
            };

            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.deep.equal(expectedData);
        });

        it('Cannot find uuid', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            delete data._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C'];

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            try {
                document.execute('update', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Target does not exist.');
            }
        });

        it('detached', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: 'detachedItem',
                data: {
                    _key: 'newName',
                    type: 'text',
                    pattern: '\\w+',
                    min: 0
                }
            };

            const result = document.execute('update', parameters);

            expect(result).to.exist();

            expect(result.uuid).to.equal(parameters.uuid);

            const doc = document.toJs();

            const expectedData = {
                _detached: true,
                _bound: false,
                _value: parameters.data
            };

            expect(doc._body.sectionA._.data.detachedItem).to.deep.equal(expectedData);
        });

        describe('With reference :', () => {
            it('addReference', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    uuid: '8823CFCE7D4645C68991332091C1A05C',
                    data: {
                        _key: 'newName',
                        type: 'text',
                        pattern: '\\w+',
                        min: 0
                    },
                    ref: {
                        uuid: 'foo',
                        type: 'entity'
                    }
                };

                const result = document.execute('update', parameters);

                expect(result).to.exist();

                expect(result.uuid).to.equal(parameters.uuid);

                const doc = document.toJs();

                const expectedData = {
                    _detached: false,
                    _bound: false,
                    _value: parameters.data,
                    _ref: {
                        uuid: 'foo',
                        type: 'entity'
                    }
                };

                expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.deep.equal(expectedData);

                expect(doc._refs.foo).to.deep.equal({
                    count: 1,
                    type: 'entity'
                });
            });

            it('removeReference', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    uuid: '40E75F3DE56B4B11B3AFBDE46785737B',
                    data: {
                        _key: 'person'
                    },
                    ref: null
                };

                const result = document.execute('update', parameters);

                expect(result).to.exist();

                expect(result.uuid).to.equal(parameters.uuid);

                const doc = document.toJs();

                const expectedData = {
                    _detached: false,
                    _bound: false,
                    _value: parameters.data,
                    _ref: null
                };

                expect(doc._body.sectionA._.data['40E75F3DE56B4B11B3AFBDE46785737B']).to.deep.equal(expectedData);

                expect(doc._refs['4ABE4F6230F148B3BAB987715B49DE22']).to.deep.equal({
                    count: 1,
                    type: 'entity'
                });
            });

            it('changeReference', () => {
                const data = CloneDeep(Data);

                changeToSectionA(data);

                const document = Document.fromJs(data, true);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'sectionA',
                    uuid: '40E75F3DE56B4B11B3AFBDE46785737B',
                    data: {
                        _key: 'person'
                    },
                    ref: {
                        uuid: 'foo',
                        type: 'other'
                    }
                };

                const result = document.execute('update', parameters);

                expect(result).to.exist();

                expect(result.uuid).to.equal(parameters.uuid);

                const doc = document.toJs();

                const expectedData = {
                    _detached: false,
                    _bound: false,
                    _value: parameters.data,
                    _ref: {
                        uuid: 'foo',
                        type: 'other'
                    }
                };

                expect(doc._body.sectionA._.data['40E75F3DE56B4B11B3AFBDE46785737B']).to.deep.equal(expectedData);

                expect(doc._refs['4ABE4F6230F148B3BAB987715B49DE22']).to.deep.equal({
                    count: 1,
                    type: 'entity'
                });

                expect(doc._refs.foo).to.deep.equal({
                    count: 1,
                    type: 'other'
                });
            });
        });
    });

    describe('Section does not exist :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            try {
                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'foo',
                    uuid: '8823CFCE7D4645C68991332091C1A05C',
                    data: {
                        _key: 'newName',
                        type: 'text',
                        pattern: '\\w+',
                        min: 0
                    }
                };

                document.execute('update', parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Section "foo" does not exist');
            }
        });
    });

    describe('Perform Set :', () => {
        it('Can find uuid', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                uuid: '8823CFCE7D4645C68991332091C1A05C',
                perform: 'set',
                data: {
                    path: 'type',
                    value: 'other'
                }
            };

            const result = document.execute('update', parameters);

            expect(result).to.exist();

            expect(result.uuid).to.equal(parameters.uuid);

            const doc = document.toJs();

            const expectedData = {
                _detached: false,
                _bound: false,
                _value: {
                    _key: 'relationship',
                    type: 'other',
                    pattern: '\\w+'
                }
            };

            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.deep.equal(expectedData);
        });
    });
});
