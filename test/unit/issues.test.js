/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import { fromJS } from 'immutable';
import IssuesOperation from '../../src/issues';

Chai.use(DirtyChai);

const { expect } = Chai;

describe('Unit :', () => {
    // function IssuesOperation(source, parameters)
    describe('Issues :', () => {
        it('Uuid undefined', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {};

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid null', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: null
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid number', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: 42
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid boolean', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: true
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid object', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: {}
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid array', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: []
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid empty string', () => {
            const source = fromJS({
                _issues: null
            });

            const parameters = {
                uuid: ''
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Argument Error: Uuid must be a string with more than one character');
            }
        });

        it('Uuid does not exist', () => {
            const source = fromJS({
                _body: {},
                _issues: {}
            });

            const parameters = {
                uuid: 'foo'
            };

            try {
                IssuesOperation(source, parameters);

                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('Not Found: Node "foo" does not exist');
            }
        });

        it('Issues Null', () => {
            const source = fromJS({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: null
            });

            const parameters = {
                uuid: 'foo'
            };

            const ret = IssuesOperation(source, parameters);

            expect(ret).to.exist();
            expect(ret.parameters).to.deep.equal({
                uuid: 'foo'
            });

            expect(ret.source).to.exist();
            expect(ret.source.toJS()).to.deep.equal({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: {
                    _: {
                    }
                }
            });
        });

        it('Issues Semi Null', () => {
            const source = fromJS({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: {
                    _: null
                }
            });

            const parameters = {
                uuid: 'foo'
            };

            const ret = IssuesOperation(source, parameters);

            expect(ret).to.exist();
            expect(ret.parameters).to.deep.equal({
                uuid: 'foo'
            });

            expect(ret.source).to.exist();
            expect(ret.source.toJS()).to.deep.equal({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: {
                    _: {
                    }
                }
            });
        });

        it('Issues not Null', () => {
            const source = fromJS({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: {
                    _: {}
                }
            });

            const parameters = {
                uuid: 'foo'
            };

            const ret = IssuesOperation(source, parameters);

            expect(ret).to.exist();
            expect(ret.parameters).to.deep.equal({
                uuid: 'foo'
            });

            expect(ret.source).to.exist();
            expect(ret.source.toJS()).to.deep.equal({
                _body: {
                    _: {
                        data: {
                            foo: {
                                _value: null
                            }
                        }
                    }
                },
                _issues: {
                    _: {
                    }
                }
            });
        });
    });
});
