import Symbol from 'es6-symbol';
import { fromJS } from 'immutable';
import IsString from 'lodash/isString';
import IsPlainObject from 'lodash/isPlainObject';
import IsBoolean from 'lodash/isBoolean';
import ForOwn from 'lodash/forOwn';
import Reduce from 'lodash/reduce';
import UuidV4 from 'uuid/v4';

import Insert from './insert';
import Update from './update';
import Move from './move';
import Remove from './remove';
import Rename from './rename';
import Issues from './issues';
import { Define, Undefine } from './section';

const FIELDS = {
    data: Symbol('data')
};

const ACTIONS = {
    insert: Insert,
    update: Update,
    define: Define,
    undefine: Undefine,
    move: Move,
    remove: Remove,
    rename: Rename,
    issues: Issues
};

let _Document = null;

function _validateIs(value, checkFn, defaultValue, message) {
    if (value == null) {
        return defaultValue;
    } else if (checkFn(value)) {
        return value;
    }

    throw new Error(`Argument Error: ${message}`);
}

function _fromJs(js, correctErrors) {
    if (!IsPlainObject(js)) {
        throw new Error('Not a plain object');
    }

    return _Document(js._uuid, js._type, js._head, js._refs, js._body, js._issues, correctErrors);
}

function _executeAction(action, parameters) {
    const options = {
        correctErrors: this._correctErrors
    };

    const result = action.call(options, this[FIELDS.data], parameters);

    if (result == null || this[FIELDS.data].equals(result.source)) {
        return null;
    }

    this[FIELDS.data] = result.source;

    return result.parameters;
}

_Document = function Document(uuid, type, head, refs, body, issues, correctErrors) {
    if (!(this instanceof _Document)) {
        return new _Document(uuid, type, head, refs, body, issues, correctErrors);
    }

    this[FIELDS.data] = fromJS({
        _uuid: _validateIs(uuid, value => IsString(value) && value.length > 0, UuidV4(), 'Invalid uuid'),
        _type: _validateIs(type, IsString, '', 'Invalid type'),
        _head: _validateIs(head, IsPlainObject, {}, 'Invalid head'),
        _refs: _validateIs(refs, IsPlainObject, {}, 'Invalid refs'),
        _body: _validateIs(body, IsPlainObject, {}, 'Invalid body'),
        _issues: _validateIs(issues, IsPlainObject, {}, 'Invalid issues')
    });

    this._correctErrors = IsBoolean(correctErrors) ? correctErrors : false;
};

_Document.fromJs = function fromJs(js, correctErrors) {
    return _fromJs(js, correctErrors);
};

_Document.fromJson = function fromJson(json, correctErrors) {
    return _fromJs(JSON.parse(json), correctErrors);
};

_Document.prototype.toJs = function toJs() {
    return this[FIELDS.data].toJS();
};

_Document.prototype.toJson = function toJson() {
    return JSON.stringify(this.toJs());
};

_Document.prototype.rename = function rename(parameters) {
    return _executeAction.call(this, Rename, parameters);
};

_Document.prototype.update = function update(parameters) {
    return _executeAction.call(this, Update, parameters);
};

_Document.prototype.insert = function insert(parameters) {
    return _executeAction.call(this, Insert, parameters);
};

_Document.prototype.remove = function remove(parameters) {
    return _executeAction.call(this, Remove, parameters);
};

_Document.prototype.move = function move(parameters) {
    return _executeAction.call(this, Move, parameters);
};

_Document.prototype.issues = function issues(parameters) {
    return _executeAction.call(this, Issues, parameters);
};

_Document.prototype.define = function define(parameters) {
    return _executeAction.call(this, Define, parameters);
};

_Document.prototype.undefine = function undefine(parameters) {
    return _executeAction.call(this, Undefine, parameters);
};

_Document.prototype.execute = function execute(...args) {
    let operations = null;

    if (args.length <= 0) {
        throw new Error('Invalid argument list (not enough)');
    } else if (args.length === 1) {
        operations = args[0];
    } else if (args.length === 2) {
        operations = [{
            action: args[0],
            parameters: args[1]
        }];
    } else if (args.length > 2) {
        throw new Error('Invalid argument list (too many)');
    }

    let currentData = this[FIELDS.data];

    const options = {
        correctErrors: this._correctErrors
    };

    const updatedParameters = Reduce(operations, (newOpList, operation) => {
        const { action, parameters } = operation;

        if (!IsPlainObject(parameters)) {
            throw new Error('Valid set of parameters is required');
        }

        const actionFunc = ACTIONS[action];

        if (actionFunc == null) {
            throw new Error(`Invalid action: ${action}`);
        }

        const result = actionFunc.call(options, currentData, parameters);

        if (result == null || currentData.equals(result.source)) {
            return newOpList;
        }

        currentData = result.source;

        ForOwn(parameters, (value, key) => {
            if (result.parameters[key] == null) {
                result.parameters[key] = value;
            }
        });

        newOpList.push(result.parameters);

        return newOpList;
    }, []);

    if (this[FIELDS.data].equals(currentData)) {
        return null;
    }

    this[FIELDS.data] = currentData;

    if (args.length === 2) {
        return updatedParameters[0];
    }

    return updatedParameters;
};

const __Document = _Document;

export default __Document;
