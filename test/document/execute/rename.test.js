/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import Document from '../../../src/document';
import data from '../../data/data.json';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('Rename :', () => {
    beforeEach(function beforeSetup() {
        this.document = Document.fromJs(data, true);
    });

    it('base', function test() {
        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            data: {
                name: 'New Name',
                description: 'New Description',
                created: 42424242424242,
                updated: 42424242424242,
                version: '1.2.3'
            }
        };

        const result = this.document.execute('rename', parameters);

        expect(result).to.exist();

        const doc = this.document.toJs();

        expect(doc._head).to.deep.equal(parameters.data);
    });
});
