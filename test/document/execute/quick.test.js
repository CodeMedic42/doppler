/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import ForEach from 'lodash/forEach';
import CloneDeep from 'lodash/cloneDeep';
import Document from '../../../src/document';
import Tests from './quick.test.json';

Chai.use(DirtyChai);

const expect = Chai.expect;

describe('Quick Tests :', () => {
    ForEach(CloneDeep(Tests.examples), (example) => {
        it(`${example.description} :`, () => {
            const document = Document.fromJs(example.before);

            document.execute(example.message.action, example.message.parameters);

            const result = document.toJs();

            expect(result).to.deep.equal(example.after);
        });
    });
});
