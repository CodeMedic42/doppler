/* eslint-disable import/no-extraneous-dependencies */
import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import { fromJS } from 'immutable';
import { UpdateReference, GetSection, FindTarget } from '../../src/common';

Chai.use(DirtyChai);

const { expect } = Chai;

describe('Unit :', () => {
    describe('Common :', () => {
        // UpdateReference(refs, existingRef, newRef)
        describe('UpdateReference :', () => {
            it('Null refs', () => {
                const refs = null;

                try {
                    UpdateReference(refs, null, null);

                    expect.fail();
                } catch (err) {
                    expect(err).to.exist();

                    expect(err.message).to.equal('Internal Error: Refs cannot be nil');
                }
            });

            describe('Empty Refs', () => {
                it('Null existingRef, Null newRef', () => {
                    const refs = {};

                    UpdateReference(refs, null, null);

                    expect(refs).to.deep.equal({});
                });

                it('Null existingRef, New newRef', () => {
                    const refs = {};
                    const newRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    UpdateReference(refs, null, newRef);

                    expect(refs).to.deep.equal({
                        foo: {
                            type: 'bar',
                            count: 1
                        }
                    });
                });

                it('targeted existingRef, Null newRef', () => {
                    const refs = {};
                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    try {
                        UpdateReference(refs, targetRef, null);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Internal Error: Reference foo does not exist');
                    }
                });

                it('targeted existingRef, New newRef, uuid not equal', () => {
                    const refs = {};
                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    const newTargetRef = {
                        uuid: 'faz',
                        type: 'bar'
                    };

                    try {
                        UpdateReference(refs, targetRef, newTargetRef);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Internal Error: Reference foo does not exist');
                    }
                });

                it('targeted existingRef, New newRef, type not equal', () => {
                    const refs = {};
                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    const newTargetRef = {
                        uuid: 'foo',
                        type: 'baz'
                    };

                    try {
                        UpdateReference(refs, targetRef, newTargetRef);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Internal Error: Reference foo does not exist');
                    }
                });

                it('targeted existingRef, New newRef, equal', () => {
                    const refs = {};
                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    const newTargetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    UpdateReference(refs, targetRef, newTargetRef);

                    expect(refs).to.deep.equal({});
                });

                describe('Invalid New Ref', () => {
                    describe('Not an object', () => {
                        it('Is a string', () => {
                            const refs = {};
                            const newRef = 'foo';

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref must an object when defined');
                            }
                        });

                        it('Is a number', () => {
                            const refs = {};
                            const newRef = 42;

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref must an object when defined');
                            }
                        });

                        it('Is a boolean', () => {
                            const refs = {};
                            const newRef = true;

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref must an object when defined');
                            }
                        });

                        it('Is an array', () => {
                            const refs = {};
                            const newRef = [];

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref must an object when defined');
                            }
                        });
                    });

                    describe('Invalid uuid', () => {
                        it('Is undefined', () => {
                            const refs = {};
                            const newRef = {
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });

                        it('Is null', () => {
                            const refs = {};
                            const newRef = {
                                uuid: null,
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });

                        it('Is a number', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 42,
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });

                        it('Is a boolean', () => {
                            const refs = {};
                            const newRef = {
                                uuid: true,
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });

                        it('Is an object', () => {
                            const refs = {};
                            const newRef = {
                                uuid: {},
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });

                        it('Is an array', () => {
                            const refs = {};
                            const newRef = {
                                uuid: [],
                                type: 'bar'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.uuid must be a string greater than zero characters');
                            }
                        });
                    });

                    describe('Invalid type', () => {
                        it('Is undefined', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo'
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });

                        it('Is null', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo',
                                type: null
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });

                        it('Is a number', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo',
                                type: 42
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });

                        it('Is a boolean', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo',
                                type: true
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });

                        it('Is an object', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo',
                                type: {}
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });

                        it('Is an array', () => {
                            const refs = {};
                            const newRef = {
                                uuid: 'foo',
                                type: []
                            };

                            try {
                                UpdateReference(refs, null, newRef);

                                expect.fail();
                            } catch (err) {
                                expect(err.message).to.equal('Argument Error: _ref.type must be a string greater than zero characters');
                            }
                        });
                    });
                });
            });

            describe('Existing Refs', () => {
                it('add', () => {
                    const refs = {
                        foo: {
                            type: 'bar',
                            count: 1
                        }
                    };

                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    UpdateReference(refs, null, targetRef);

                    expect(refs).to.deep.equal({
                        foo: {
                            type: 'bar',
                            count: 2
                        }
                    });
                });

                it('remove', () => {
                    const refs = {
                        foo: {
                            type: 'bar',
                            count: 1
                        }
                    };

                    const targetRef = {
                        uuid: 'foo',
                        type: 'bar'
                    };

                    UpdateReference(refs, targetRef, null);

                    expect(refs).to.deep.equal({});
                });

                it('type missmatch', () => {
                    const refs = {
                        foo: {
                            type: 'bar',
                            count: 1
                        }
                    };

                    const targetRef = {
                        uuid: 'foo',
                        type: 'baz'
                    };

                    try {
                        UpdateReference(refs, null, targetRef);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Existing reference type of "bar" does not match type of "baz"');
                    }
                });
            });
        });

        // GetSection(source, part, sectionDef)
        describe('GetSection', () => {
            it('source is null', () => {
                try {
                    GetSection(null, '_body');

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Internal Error: Source cannot be nil');
                }
            });

            it('part is undefined', () => {
                const sourceData = {};
                const source = fromJS(sourceData);

                try {
                    GetSection(source);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Internal Error: Part cannot be nil');
                }
            });

            it('sectionDef is null', () => {
                const sourceData = {};
                const source = fromJS(sourceData);

                try {
                    GetSection(source, null);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Internal Error: Part cannot be nil');
                }
            });

            describe('Invalid sectionDef is null', () => {
                it('is number', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', 42);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is boolean', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', true);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is Object', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', {});

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is array', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', []);

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is string, "_"', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', '_');

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is string, "foo._"', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', 'foo._');

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is string, "_.foo"', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', '_.foo');

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is string, "foo._.bar"', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', 'foo._.bar');

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });

                it('is string, "_._"', () => {
                    const sourceData = {};
                    const source = fromJS(sourceData);

                    try {
                        GetSection(source, '_body', '_._');

                        expect.fail();
                    } catch (err) {
                        expect(err.message).to.equal('Argument Error: Section must be a dot notated string where "_" is not allowed to be used by itself');
                    }
                });
            });
        });

        // FindTarget(layout, path, ignorelast, errorCorrect)
        describe('FindTarget', () => {
            it('target path undefined', () => {
                const layout = [];

                try {
                    FindTarget(layout);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path null', () => {
                const layout = [];

                try {
                    FindTarget(layout, null);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path number', () => {
                const layout = [];

                try {
                    FindTarget(layout, 42);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path bool', () => {
                const layout = [];

                try {
                    FindTarget(layout, true);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path string', () => {
                const layout = [];

                try {
                    FindTarget(layout, 'foo');

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path object', () => {
                const layout = [];

                try {
                    FindTarget(layout, {});

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });

            it('target path empty array', () => {
                const layout = [];

                try {
                    FindTarget(layout, []);

                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('Argument Error: Layout selection must define at least one target item');
                }
            });
        });

        // ApplySection(source, part, sectionDef, section)
        describe('ApplySection', () => {});

        // ApplyData(source, sectionDef, uuid, data)
        describe('ApplyData', () => {});

        // ClearSectionRefs(sectionBody, refs)
        describe('ClearSectionRefs', () => {});
    });
});
