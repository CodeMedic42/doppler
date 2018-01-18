/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import Document from '../../../src/document';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('Define :', () => {
    it('Section does not exist', () => {
        const document = Document();

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('define', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({
            foo: {
                bar: {}
            }
        });
    });

    it('Section already exists', () => {
        const data = {
            _uuid: 'foo',
            _type: '',
            _head: {},
            _body: {
                foo: {
                    bar: {
                    }
                }
            }
        };

        const document = Document.fromJs(data);

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('define', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({
            foo: {
                bar: {}
            }
        });
    });

    it('Partical section already exists', () => {
        const data = {
            _uuid: 'foo',
            _type: '',
            _head: {},
            _body: {
                foo: {
                }
            }
        };

        const document = Document.fromJs(data);

        const parameters = {
            documentId: 'B93E416D505E4596BE8276AC4D380C9C',
            documentType: 'entity',
            section: 'foo.bar'
        };

        document.execute('define', parameters);

        const doc = document.toJs();

        expect(doc._body).to.deep.equal({
            foo: {
                bar: {}
            }
        });
    });
});
