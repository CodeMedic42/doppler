import Joi from 'joi';

const nodeUuidPattern = /^.+$/;
const documentUuidPattern = /^.+$/;
const layoutGroupPattern = /^.+$/;

const dataRefSchema = Joi.object()
    .keys({
        _uuid: documentUuidPattern,
        _type: Joi.string().min(1)
    });

let layoutNodeSchema = null;

const layoutGroupSchema = Joi.array().items(Joi.lazy(() => layoutNodeSchema));

const layoutGroupsSchema = Joi.object()
    .pattern(layoutGroupPattern, layoutGroupSchema);

layoutNodeSchema = Joi.object().keys({
    _uuid: Joi.string().min(1).pattern(nodeUuidPattern),
    _groups: layoutGroupsSchema
});

const bodySectionSchema = Joi.object()
    .keys({
        _: Joi.object()
            .keys({
                _layout: layoutGroupsSchema,
                _data: Joi.object()
                    .pattern(nodeUuidPattern, Joi.object()
                        .keys({
                            _value: Joi.any(),
                            _ref: dataRefSchema,
                            _bound: Joi.boolean(),
                            _detached: Joi.boolean()
                        }))
            })
    })
    .pattern(/^[^\s]*_[^\s]+|[^\s]+_|[^_\s]*$/, Joi.lazy(() => bodySectionSchema));

const refsSchema = Joi.object()
    .pattern(documentUuidPattern, {
        count: Joi.number().min(1),
        type: Joi.string().min(1),
    });

const issuesSchema = Joi.object()
    .pattern(nodeUuidPattern, Joi.any());

const documentSchema = Joi.object().keys({
    _uuid: Joi.string().min(1),
    _type: Joi.string().min(1),
    _head: Joi.object(),
    _body: bodySectionSchema,
    _refs: refsSchema,
    _issues: issuesSchema
});

module.exports.schema = () => {
    return documentSchema;
};

module.exports.Validate = (document) => {
    return Joi.validate(document, documentSchema);
};
