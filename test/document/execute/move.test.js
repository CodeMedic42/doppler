/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import UuidV4 from 'uuid/v4';
import CloneDeep from 'lodash/cloneDeep';

import Document from '../../../src/document';
import Data from '../../data/data.json';
import { normalizeParameters } from '../../common';

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

describe('Move :', () => {
    describe('Correct Error :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._.length).to.equal(3);
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            const result = document.execute('move', parameters);

            parameters.put[0].index = 3;
            parameters.pull[0].index = 3;

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            // Should not have been removed
            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.exist();

            // Should be at index 1
            expect(doc._body.sectionA._.layout._[3].groups._[0].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');

            // index 0 should be
            expect(doc._body.sectionA._.layout._[3].groups._[0].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            const result = document.execute('move', parameters);

            parameters.put[0].index = 1;
            parameters.pull[0].index = 1;

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            // Should not have been removed
            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.exist();

            // Should be at index 1
            expect(doc._body.sectionA._.layout._[1].groups._[0].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');

            // index 0 should be
            expect(doc._body.sectionA._.layout._[1].groups._[0].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal({
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 8,
                    group: '_',
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    group: '_',
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 8,
                    group: '_',
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    group: '_',
                    index: 1
                }],
            });

            const doc = document.toJs();

            expect(doc._body.sectionA._.data['8823CFCE7D4645C68991332091C1A05C']).to.exist();

            // Should be at index 1
            expect(doc._body.sectionA._.layout._[8].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');

            // index 0 should be
            expect(doc._body.sectionA._.layout._[8].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            try {
                document.execute('move', parameters);

                expect().fail();
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._.length).to.equal(3);
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');
        });

        it('index +1', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const extraUuid = UuidV4();

            data._body.sectionA._.layout._.unshift({
                uuid: extraUuid
            });

            data._body.sectionA._[extraUuid] = {
                type: 'text'
            };

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            try {
                document.execute('move', parameters);

                expect().fail();
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            try {
                document.execute('move', parameters);

                expect().fail();
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            try {
                document.execute('move', parameters);

                expect().fail();
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
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }]
            };

            try {
                document.execute('move', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem');
            }
        });

        it('move to child of sibling', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 5,
                    uuid: 'B9A39766B17E4406864D785DB6893C3D'
                }],
                put: [{
                    index: 7,
                    uuid: '385690A445FA4F90998C136506EE902B'
                }, {
                    index: 0
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(7);
            expect(doc._body.sectionA._.layout._[6].groups._.length).to.equal(1);
            expect(doc._body.sectionA._.layout._[6].groups._[0].uuid).to.equal('B9A39766B17E4406864D785DB6893C3D');
        });

        it('move to different position(4->0) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 4,
                    uuid: '9152B3DEF40F414BBBC68CACE2F5F6E4'
                }],
                put: [{
                    index: 0
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(8);
            expect(doc._body.sectionA._.layout._[0].uuid).to.equal('9152B3DEF40F414BBBC68CACE2F5F6E4');
        });

        it('move to different position(4->2) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 4,
                    uuid: '9152B3DEF40F414BBBC68CACE2F5F6E4'
                }],
                put: [{
                    index: 2
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(8);
            expect(doc._body.sectionA._.layout._[2].uuid).to.equal('9152B3DEF40F414BBBC68CACE2F5F6E4');
        });

        it('move to different position(4->4) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 4,
                    uuid: '9152B3DEF40F414BBBC68CACE2F5F6E4'
                }],
                put: [{
                    index: 4
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.not.exist();

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(8);
            expect(doc._body.sectionA._.layout._[4].uuid).to.equal('9152B3DEF40F414BBBC68CACE2F5F6E4');
        });

        it('move to different position(4->5) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 4,
                    uuid: '9152B3DEF40F414BBBC68CACE2F5F6E4'
                }],
                put: [{
                    index: 5
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(8);
            expect(doc._body.sectionA._.layout._[5].uuid).to.equal('9152B3DEF40F414BBBC68CACE2F5F6E4');
        });

        it('move to different position(4->6) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 4,
                    uuid: '9152B3DEF40F414BBBC68CACE2F5F6E4'
                }],
                put: [{
                    index: 6
                }]
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._.length).to.equal(8);
            expect(doc._body.sectionA._.layout._[6].uuid).to.equal('9152B3DEF40F414BBBC68CACE2F5F6E4');
        });

        it('move sub to different position(0->1) at same level', () => {
            const data = CloneDeep(Data);

            changeToSectionA(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section: 'sectionA',
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }],
                put: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 1
                }],
            };

            const result = document.execute('move', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._.length).to.equal(3);
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[0].uuid).to.equal('58A9345E881F48C980498C7FFB68667D');
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[1].uuid).to.equal('8823CFCE7D4645C68991332091C1A05C');
            expect(doc._body.sectionA._.layout._[2].groups._[0].groups._[2].uuid).to.equal('2FB36217D01F4DA4B7E965BA3E1B45CE');
        });
    });

    describe('Section does not exist', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

            try {
                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section: 'foo',
                    pull: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 0,
                        uuid: '8823CFCE7D4645C68991332091C1A05C'
                    }],
                    put: [{
                        index: 2,
                        uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                    }, {
                        index: 0,
                        uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                    }, {
                        index: 1
                    }]
                };

                document.execute('move', parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Section "foo" does not exist');
            }
        });
    });
});
