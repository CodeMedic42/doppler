/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import Document from '../../../src/document';
import data from '../../data/data.json';

Chai.use(DirtyChai);

const expect = Chai.expect;

xdescribe('Issues :', () => {
    beforeEach(function beforeSetup() {
        this.document = Document.fromJs(data, false);
    });

    beforeEach(function addSectionA() {
        this.document._layout.sectionA = {
            _: this.document._layout._
        };

        this.document._data.sectionA = {
            _: this.document._data._
        };

        this.document._issues.sectionA = {
            _: this.document._issues._
        };

        delete this.document._layout._;
        delete this.document._data._;
        delete this.document._issues._;
    });

    it('Add issue', function test() {
        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'sectionA',
            uuid: 'CD4A9E5539FF4B5FA4940C1D063CCA63',
            data: {
                '123A': {
                    severity: 'error',
                    message: 'Dude where\'s my car?'
                }
            }
        };

        const result = this.document.execute('issues', parameters);

        expect(result).to.deep.equal(parameters);

        expect(this.document._issues.sectionA._.CD4A9E5539FF4B5FA4940C1D063CCA63).to.exist();
        expect(this.document._issues.sectionA._.CD4A9E5539FF4B5FA4940C1D063CCA63['123A'].severity).to.equal('error');
        expect(this.document._issues.sectionA._.CD4A9E5539FF4B5FA4940C1D063CCA63['123A'].message).to.equal('Dude where\'s my car?');
    });

    it('remove issue', function test() {
        this.document._issues.sectionA._['123A'] = {
            severity: 'error',
            message: 'Dude where\'s my car?'
        };

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'sectionA',
            uuid: 'CD4A9E5539FF4B5FA4940C1D063CCA63',
            data: null
        };

        const result = this.document.execute('issues', parameters);

        expect(result).to.deep.equal(parameters);

        expect(this.document._issues.sectionA._.CD4A9E5539FF4B5FA4940C1D063CCA63).to.not.exist();
    });
});
