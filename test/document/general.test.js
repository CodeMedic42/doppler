/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import _ from 'lodash';
// import UuidV4 from 'uuid/v4';
import Document from '../../src/document';
import data from '../data/data.json';

Chai.use(DirtyChai);

const expect = Chai.expect;

xdescribe('General :', () => {
    beforeEach(function beforeSetup() {
        this.document = Document.fromJs(data, true);
    });

    it('toJson', () => {
        const jsonData = JSON.stringify(data);

        const document = Document.fromJson(jsonData, true);

        const result = document.toJson();

        expect(result).to.deep.equal(jsonData);
    });

    it('toJs', function test() {
        const result = this.document.toJs();

        expect(result).to.deep.equal(data);
    });

    it('toJson', function test() {
        const result = this.document.toJson();

        expect(result).to.deep.equal(JSON.stringify(data));
    });

    it('constructor', () => {
        const document = Document();

        expect(document._correctErrors).to.be.false();

        expect(_.isString(document._uuid)).to.be.true();
        expect(document._uuid.length).to.be.greaterThan(0);

        expect(document._type).to.equal('');

        expect(document._head).to.deep.equal({});
        expect(document._layout).to.deep.equal({
            _: {}
        });
        expect(document._data).to.deep.equal({
            _: {}
        });
    });
});
