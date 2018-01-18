/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import { fromJS } from 'immutable';
import { Define, Undefine } from '../../src/section';

Chai.use(DirtyChai);

const { expect } = Chai;

describe('Unit :', () => {
    describe('Section :', () => {
        // function Define(source, parameters)
        describe('Define :', () => {
            it('Undefined Section', () => {
                const source = fromJS({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
                const parameters = {};

                try {
                    Define(fromJS(source), parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Invalid section');
                }
            });

            it('Null Section', () => {
                const source = fromJS({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
                const parameters = {
                    section: null
                };

                try {
                    Define(fromJS(source), parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Invalid section');
                }
            });

            it('Empty Section', () => {
                const source = fromJS({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
                const parameters = {
                    section: ''
                };

                const ret = Define(fromJS(source), parameters);

                expect(ret).to.not.exist();
            });
        });

        // function Undefine(source, parameters)
        describe('Undefine :', () => {
            it('Undefined Section', () => {
                const source = fromJS({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
                const parameters = {};

                try {
                    Undefine(fromJS(source), parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Invalid section');
                }
            });

            it('Null Section', () => {
                const source = fromJS({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
                const parameters = {
                    section: null
                };

                try {
                    Undefine(fromJS(source), parameters);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Invalid section');
                }
            });

            it('Empty String', () => {
                const source = fromJS({
                    _body: {
                        _: {
                            data: {},
                            layout: []
                        }
                    },
                    _issues: {
                        _: {}
                    },
                    _refs: {}
                });
                const parameters = {
                    section: ''
                };

                const ret = Undefine(fromJS(source), parameters);

                expect(ret).to.exist();
                expect(ret.parameters).to.deep.equal({
                    section: ''
                });

                expect(ret.source).to.exist();
                expect(ret.source.toJS()).to.deep.equal({
                    _body: {},
                    _issues: {},
                    _refs: {}
                });
            });
        });
    });
});
