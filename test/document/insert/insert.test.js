// import Chai from 'chai';
// import DirtyChai from 'dirty-chai';
// // import _ from 'lodash';
// import UuidV4 from 'uuid/v4';
// import Document from '../../../src/document';
// import data from '../../data/data.json';
//
// Chai.use(DirtyChai);
//
// const expect = Chai.expect;
//
// describe('Insert :', () => {
//     describe('Correct Error :', () => {
//         beforeEach(function beforeSetup() {
//             this.document = Document.fromJs(data, true);
//         });
//
//         it('base', function test() {
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.insert(parameters.put, parameters.data);
//
//             const createdUuid = result[2].uuid;
//             delete result[2].uuid;
//
//             expect(result).to.deep.equal(parameters.put);
//
//             expect(this.document._data.sectionA[createdUuid]).to.deep.equal(parameters.data);
//             expect(this.document._layout.sectionA[2].children[0].children[0].uuid).to.equal(createdUuid);
//         });
//
//         xit('index +1', function test() {
//             const extraUuid = UuidV4();
//
//             this.document._layout.unshift({
//                 uuid: extraUuid
//             });
//
//             this.document._data.sectionA[extraUuid] = {
//                 type: 'text'
//             };
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             parameters.put[0].index = 3;
//
//             const createdUuid = result.put[2].uuid;
//             delete result.put[2].uuid;
//
//             expect(result).to.deep.equal(parameters);
//
//             expect(this.document._data.sectionA[createdUuid]).to.deep.equal(parameters.data);
//             expect(this.document._layout.sectionA[3].children[0].children[0].uuid).to.equal(createdUuid);
//         });
//
//         xit('index -1', function test() {
//             const removedItem = this.document._layout.shift();
//
//             delete this.document._data.sectionA[removedItem.uuid];
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             parameters.put[0].index = 1;
//
//             const createdUuid = result.put[2].uuid;
//             delete result.put[2].uuid;
//
//             expect(result).to.deep.equal(parameters);
//
//             expect(this.document._data.sectionA[createdUuid]).to.deep.equal(parameters.data);
//             expect(this.document._layout.sectionA[1].children[0].children[0].uuid).to.equal(createdUuid);
//         });
//
//         xit('in different location altogether', function test() {
//             const movedItem = this.document._layout.sectionA[2].children.pop();
//             this.document._layout.push(movedItem);
//             this.document._data.sectionA[movedItem.uuid].name = 'moved';
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             const createdUuid = result.put[1].uuid;
//             delete result.put[1].uuid;
//
//             expect(result).to.deep.equal({
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 6,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: parameters.data
//             });
//
//             expect(this.document._data.sectionA[createdUuid]).to.deep.equal(parameters.data);
//             expect(this.document._layout.sectionA[6].children[0].uuid).to.equal(createdUuid);
//         });
//
//         xit('not found', function test() {
//             const movedItem = this.document._layout.sectionA[2].children.pop();
//             delete this.document._data.sectionA[movedItem.uuid];
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             expect(result).to.not.exist();
//         });
//     });
//
//     describe('Do Not Correct Error :', () => {
//         beforeEach(function beforeSetup() {
//             this.document = Document.fromJs(data, false);
//         });
//
//         it('base', function test() {
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             const createdUuid = result.put[2].uuid;
//             delete result.put[2].uuid;
//
//             expect(result).to.deep.equal(parameters);
//
//             expect(this.document._data.sectionA[createdUuid]).to.deep.equal(parameters.data);
//             expect(this.document._layout.sectionA[2].children[0].children[0].uuid).to.equal(createdUuid);
//         });
//
//         it('index +1', function test() {
//             const extraUuid = UuidV4();
//
//             this.document._layout.unshift({
//                 uuid: extraUuid
//             });
//
//             this.document._data.sectionA[extraUuid] = {
//                 type: 'text'
//             };
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             expect(result).to.not.exist();
//         });
//
//         it('index -1', function test() {
//             const removedItem = this.document._layout.shift();
//
//             delete this.document._data.sectionA[removedItem.uuid];
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             expect(result).to.not.exist();
//         });
//
//         it('in different location altogether', function test() {
//             const movedItem = this.document._layout.sectionA[2].children.pop();
//             this.document._layout.push(movedItem);
//             this.document._data.sectionA[movedItem.uuid].name = 'moved';
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             expect(result).to.not.exist();
//         });
//
//         it('not found', function test() {
//             const movedItem = this.document._layout.sectionA[2].children.pop();
//             delete this.document._data.sectionA[movedItem.uuid];
//
//             const parameters = {
//                 documentId: 'B93E416D505E4596BE8276AC4D380C9C',
//                 documentType: 'entity',
//                 put: [{
//                     index: 2,
//                     uuid: '34F209A883D3406FBA6BACD9E07DB1D9'
//                 }, {
//                     index: 0,
//                     uuid: 'F429C51BF01C405DA517616E0E16DE4E'
//                 }, {
//                     index: 0
//                 }],
//                 data: {
//                     type: 'text',
//                     _key: 'foo'
//                 }
//             };
//
//             const result = this.document.execute('insert', parameters);
//
//             expect(result).to.not.exist();
//         });
//     });
//
//     describe('Invalid Input :', () => {
//
//     });
// });
