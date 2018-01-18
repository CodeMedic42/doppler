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

function removeTests(section, extraBeforeEach) {
    describe('Correct Error :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            const dataSection = section == null ? doc._body._.data : doc._body[section]._.data;
            const layoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

            expect(dataSection['8823CFCE7D4645C68991332091C1A05C']).to.not.exist();
            expect(layoutSection._[2].groups._[0].groups._.length).to.equal(2);
        });

        it('index +1', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const extraUuid = UuidV4();

            layoutSection._.unshift({
                uuid: extraUuid
            });

            dataSection[extraUuid] = {
                type: 'text'
            };

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            parameters.pull[0].index = 3;

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;
            const newLayoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

            expect(newDataSection['8823CFCE7D4645C68991332091C1A05C']).to.not.exist();
            expect(newLayoutSection._[3].groups._[0].groups._.length).to.equal(2);
        });

        it('index -1', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const removedItem = layoutSection._.shift();

            delete dataSection[removedItem.uuid];

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            parameters.pull[0].index = 1;

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;
            const newLayoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

            expect(newDataSection['8823CFCE7D4645C68991332091C1A05C']).to.not.exist();
            expect(newLayoutSection._[1].groups._[0].groups._.length).to.equal(2);
        });

        it('in different location altogether', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const movedItem = layoutSection._[2].groups._.pop();
            layoutSection._.push(movedItem);
            dataSection[movedItem.uuid].name = 'moved';

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal({
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 8,
                    group: '_',
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    group: '_',
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            });

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;
            const newLayoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

            expect(newDataSection['8823CFCE7D4645C68991332091C1A05C']).to.not.exist();
            expect(newLayoutSection._[8].groups._.length).to.equal(2);
        });

        it('not found', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const movedItem = layoutSection._[2].groups._.pop();
            delete dataSection[movedItem.uuid];

            const document = Document.fromJs(data, true);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            try {
                document.execute('remove', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem (Checked the whole tree)');
            }
        });
    });

    describe('Do Not Correct Error :', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal(normalizeParameters(parameters));

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;
            const newLayoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

            expect(newDataSection['8823CFCE7D4645C68991332091C1A05C']).to.not.exist();
            expect(newLayoutSection._[2].groups._[0].groups._.length).to.equal(2);
        });

        it('index +1', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const extraUuid = UuidV4();

            layoutSection._.unshift({
                uuid: extraUuid
            });

            dataSection[extraUuid] = {
                type: 'text'
            };

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            try {
                document.execute('remove', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem');
            }
        });

        it('index -1', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const removedItem = layoutSection._.shift();

            delete dataSection[removedItem.uuid];

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            try {
                document.execute('remove', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem');
            }
        });

        it('in different location altogether', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const movedItem = layoutSection._[2].groups._.pop();
            layoutSection._.push(movedItem);
            dataSection[movedItem.uuid].name = 'moved';

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            try {
                document.execute('remove', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem');
            }
        });

        it('Corupted document state', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const movedItem = layoutSection._[2].groups._.pop();
            delete dataSection[movedItem.uuid];

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            try {
                document.execute('remove', parameters);

                expect().fail();
            } catch (err) {
                expect(err.message).to.equal('Unable to find targetItem');
            }
        });

        it('not found', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;
            const layoutSection = section == null ? data._body._.layout : data._body[section]._.layout;

            const movedItem = layoutSection._[2].groups._[0].groups._.shift();
            delete dataSection[movedItem.uuid];

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: [{
                    index: 2,
                    uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
                }, {
                    index: 0,
                    uuid: 'F429C51BF01C405DA517616E0E16DE4E'
                }, {
                    index: 0,
                    uuid: '8823CFCE7D4645C68991332091C1A05C'
                }]
            };

            const result = document.execute('remove', parameters);

            expect(result).to.not.exist();
        });

        describe('With reference change :', () => {
            it('decrement', () => {
                const data = CloneDeep(Data);

                extraBeforeEach(data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section,
                    pull: [{
                        index: 0,
                        uuid: '40E75F3DE56B4B11B3AFBDE46785737B'
                    }]
                };

                const result = document.execute('remove', parameters);

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const dataSection = section == null ? doc._body._.data : doc._body[section]._.data;
                const layoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

                expect(dataSection['40E75F3DE56B4B11B3AFBDE46785737B']).to.not.exist();
                expect(layoutSection._.length).to.equal(7);

                expect(doc._refs['4ABE4F6230F148B3BAB987715B49DE22']).to.deep.equal({
                    count: 1,
                    type: 'entity'
                });
            });

            it('existing reference', () => {
                const data = CloneDeep(Data);

                extraBeforeEach(data);

                const document = Document.fromJs(data, false);

                const parameters = {
                    documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                    documentType: 'entity',
                    section,
                    pull: [{
                        index: 6,
                        uuid: 'CD4A9E5539FF4B5FA4940C1D063CCA63'
                    }]
                };

                const result = document.execute('remove', parameters);

                expect(result).to.deep.equal(normalizeParameters(parameters));

                const doc = document.toJs();

                const dataSection = section == null ? doc._body._.data : doc._body[section]._.data;
                const layoutSection = section == null ? doc._body._.layout : doc._body[section]._.layout;

                expect(dataSection.CD4A9E5539FF4B5FA4940C1D063CCA63).to.not.exist();
                expect(layoutSection._.length).to.equal(7);

                expect(doc._refs['5FE98E00DBCC405E8150CC6035BFBA13']).to.not.exist();
            });
        });
    });

    describe('detached :', () => {
        it('exists', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: 'detachedItem'
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal(parameters);

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;

            expect(newDataSection.detachedItem).to.not.exist();
        });

        it('does not exist', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: 'detachedItemDNE'
            };

            const result = document.execute('remove', parameters);

            expect(result).to.not.exist();

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body._.data : doc._body[section]._.data;

            expect(newDataSection.detachedItemDNE).to.not.exist();
        });

        it('is not detached', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: '385690A445FA4F90998C136506EE902B'
            };

            try {
                document.execute('remove', parameters);

                expect().to.fail();
            } catch (err) {
                expect(err.message).to.equal('Target item is attached to layout');
            }
        });
    });

    describe('bound :', () => {
        it('exists and bound', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;

            if (section != null) {
                data._body[section].detachedItem = {};
            } else {
                data._body.detachedItem = {};
            }

            expect(dataSection.detachedItem).to.exist();

            dataSection.detachedItem._bound = true;

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: 'detachedItem'
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal(parameters);

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body : doc._body[section];

            expect(newDataSection._.data.detachedItem).to.not.exist();
            expect(newDataSection.detachedItem).to.not.exist();
        });

        it('exists and not bound', () => {
            const data = CloneDeep(Data);

            extraBeforeEach(data);

            const dataSection = section == null ? data._body._.data : data._body[section]._.data;

            if (section != null) {
                data._body[section].detachedItem = {};
            } else {
                data._body.detachedItem = {};
            }

            expect(dataSection.detachedItem).to.exist();

            const document = Document.fromJs(data, false);

            const parameters = {
                documentId: 'B93E416D505E4596BE8276AC4D380C9C',
                documentType: 'entity',
                section,
                pull: 'detachedItem'
            };

            const result = document.execute('remove', parameters);

            expect(result).to.deep.equal(parameters);

            const doc = document.toJs();

            const newDataSection = section == null ? doc._body : doc._body[section];

            expect(newDataSection._.data.detachedItem).to.not.exist();
            expect(newDataSection.detachedItem).to.exist();
        });
    });
}

describe('Remove :', () => {
    describe('No Section :', () => {
        removeTests(null, () => {});
    });

    describe('Defined Section :', () => {
        removeTests('sectionA', (data) => {
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
        });
    });

    describe('Section does not exist', () => {
        it('base', () => {
            const data = CloneDeep(Data);

            const document = Document.fromJs(data, true);

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
                }]
            };

            const result = document.execute('remove', parameters);

            expect(result).to.not.exist();
        });
    });
});
