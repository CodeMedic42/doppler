/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import { fromJS } from 'immutable';
import Document from '../../src/document';

Chai.use(DirtyChai);

const { expect } = Chai;

describe('Unit :', () => {
    // function IssuesOperation(source, parameters)
    describe('Document :', () => {
        it('New empty document', () => {
            const doc = Document();

            const ret = doc.toJs();

            expect(ret._uuid).to.be.a('string');
            delete ret._uuid;

            expect(ret).to.deep.equal({
                _body: {},
                _issues: {},
                _refs: {},
                _head: {},
                _type: ''
            });
        });

        describe('Insert', () => {
            it('', () => {
                const doc = Document();

                const parameters = {
                    section: 'foo',
                    put: 'bar',
                    data: 42
                };

                const finalParameters = doc.insert(parameters);

                expect(finalParameters).to.deep.equal({
                    section: 'foo',
                    put: 'bar',
                    data: 42,
                    bind: false
                });

                const ret = doc.toJs();

                delete ret._uuid;

                expect(ret).to.deep.equal({
                    _body: {
                        foo: {
                            _: {
                                layout: {},
                                data: {
                                    bar: {
                                        _value: 42,
                                        _detached: true,
                                        _bound: false
                                    }
                                }
                            }
                        }
                    },
                    _issues: {},
                    _refs: {},
                    _head: {},
                    _type: ''
                });
            });
        });

        describe('Remove', () => {
            it('', () => {
                const doc = Document.fromJs({
                    _body: {
                        foo: {
                            _: {
                                layout: {},
                                data: {
                                    bar: {
                                        _value: 42,
                                        _detached: true,
                                        _bound: false
                                    }
                                }
                            }
                        }
                    },
                    _issues: {},
                    _refs: {},
                    _head: {},
                    _type: ''
                });

                const parameters = {
                    section: 'foo',
                    pull: 'bar'
                };

                debugger;

                const finalParameters = doc.remove(parameters);

                expect(finalParameters).to.deep.equal({
                    section: 'foo',
                    pull: 'bar'
                });

                const ret = doc.toJs();

                delete ret._uuid;

                expect(ret).to.deep.equal({
                    _body: {
                        foo: {
                            _: {
                                layout: {},
                                data: {}
                            }
                        }
                    },
                    _issues: {},
                    _refs: {},
                    _head: {},
                    _type: ''
                });
            });
        });
    });
});
