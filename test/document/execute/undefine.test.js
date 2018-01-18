/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import CloneDeep from 'lodash/cloneDeep';
import Document from '../../../src/document';

Chai.use(DirtyChai);

const expect = Chai.expect;

const _data = {
    _uuid: 'foo',
    _type: '',
    _body: {
        foo: {
            bar: {
                _: {
                    layout: {
                        _: [{
                            uuid: 'idOfThing'
                        }]
                    },
                    data: {
                        idOfThing: 42
                    }
                }
            }
        }
    },
    _issues: {
        foo: {
            bar: {
                _: {
                    idOfThing: 'issue'
                }
            }
        }
    }
};

describe('Undefine :', () => {
    it('Section does not exist at all or in part', () => {
        const document = Document();

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('undefine', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({});
        expect(doc._issues).to.deep.equal({});
    });

    it('Has child nodes', () => {
        const data = CloneDeep(_data);

        const document = Document.fromJs(data);

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('undefine', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({
            foo: {}
        });

        expect(doc._issues).to.deep.equal({
            foo: {}
        });
    });

    it('Has child sections which have child nodes', () => {
        const data = CloneDeep(_data);

        const document = Document.fromJs(data);

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo'
        };

        document.execute('undefine', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({});

        expect(doc._issues).to.deep.equal({});
    });

    it('Section does not exist but does in part', () => {
        const data = CloneDeep(_data);

        delete data._body.foo.bar;
        delete data._issues.foo.bar;

        const document = Document.fromJs(data);

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('undefine', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({
            foo: {}
        });

        expect(doc._issues).to.deep.equal({
            foo: {}
        });
    });
});
