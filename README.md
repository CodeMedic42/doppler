## Operational Document

The core of the collaboration system is the operational document. The design of its structrue and the operations which can be performed on it are an attempt to make small changes quickly and with an extremely low chance of error or conflit.

### Schema
The schema of this document is
```json
{
    "definitions": {
        "layoutNode": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string",
                    "minLength": 1
                },
                "children": {
                    "$ref": "#/definitions/layoutChildren"
                }
            },
            "required": [ "uuid" ]
        },
        "layoutGroup": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/layoutNode"
            }
        },
        "layoutChildren": {
            "type": "object",
            "additionalProperties": {
                "$ref": "#/definitions/layoutGroup"
            }
        },
        "layoutSection": {
            "type": "object",
            "properties": {
                "_": {
                    "$ref": "#/definitions/layoutChildren"
                }
            },
            "additionalProperties": {
                "$ref": "#/definitions/layoutSection"
            }
        },
        "dataNode": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "_value": {
                        "type": "any"
                    },
                    "_ref": {
                        "type": "object",
                        "properties": {
                            "uuid": {
                                "type": "string",
                                "min": "1"
                            },
                            "type": {
                                "type": "string",
                                "min": "1"
                            }
                        },
                        "default": null,
                        "required": [ "uuid", "type" ]
                    },
                    "_detached": {
                        "type": "bool",
                        "default": "false"
                    },
                    "_bound": {
                        "type": "bool",
                        "default": "false"
                    }
                }
            }
        },
        "dataSection": {
            "type": "object",
            "properties": {
                "_": {
                    "$ref": "#/definitions/dataNode"
                }
            },
            "additionalProperties": {
                "$ref": "#/definitions/dataSection"
            }
        },
        "issuesNode": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "additionalProperties": {
                    "type": "any"
                }
            }
        },
        "issuesSection": {
            "type": "object",
            "properties": {
                "_": {
                    "$ref": "#/definitions/issuesNode"
                }
            },
            "additionalProperties": {
                "$ref": "#/definitions/issuesSection"
            }
        }
    },
    "type": "object",
    "properties": {
        "_uuid": {
            "type": "string",
            "minLength": 1
        },
        "_type": {
            "type": "string",
            "minLength": 1
        },
        "_head": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 1
                },
                "description": {
                    "type": "string",
                },
                "created": {
                    "type": "number",
                },
                "updated": {
                    "type": "number",
                },
                "version": {
                    "type": "string",
                    "pattern": "^\\d+\\.\\d+\\.\\d+$"
                }
            }
        },
        "_refs": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "count": {
                        "type": "number",
                        "min": 1
                    },
                    "type": {
                        "type": "string",
                        "minLength": 1
                    }
                },
                "required": ["count", "type"]
            }
        },
        "_body": {
            "type": "object",
            "properties": {
                "_layout": {
                    "$ref": "#/definitions/layoutSection"
                },
                "_data": {
                    "$ref": "#/definitions/dataSection"
                }
            },
            "required": ["_layout", "_body"]
        },
        "_issues": {
            "$ref": "#/definitions/issuesSection"
        }
    },
    "required": ["_uuid", "_type", "_head"]
}
```

### Document Sections

#### UUID
This property is a unique identifier for a document. It's value is determined by the system it is being used in.

#### Type
This property is one which defines the document and the data which is contained in th body. It's value is determined by the system it is being used in.

#### Head
This property containes static data about a document.

##### Name
This is a human readable name for the document.

##### Description
This is a human readable string which provides a summary of what the document is for or why it exists.

##### Created
This is an epoch value for when the document was created.

##### Updated
This is an epoch value for when the document was last updated.

##### Version
This is a string which is not the format of a three part version.

#### References(refs)
This section declares what other documents this document references.
Each property in this section is the uuid of the document which is references. The value for this key is another object which contains a count of the number of times it is referenced and the type of document it is referencing.

This section should not be updated directly but will be updated as node in the body declare references.

#### Body
The data contained in the body is defined dynamicly based on the system and the type of the document and how that system interprets data for that type. Each data point, called a node, is broken up into two parts:

- Layout - The layout part defines the structure of the data. It decribes how each node in the data interrelates to each other node.
- Data - The data part defines the data the node encapsulates.

##### Rules
- Each of these two parts can have the data broken up into sections.
- Each section is another object which can contain sections.
- When a section is defined this section must exist in both parts.
- Each section has a special key "_" which is used to contain the data for the section.
- A node defined in a section must have an id defined which is unique within that section.
- A node defined in a section in layout must exist in the same section in data.
- A node can defined in data without it existing in layout as long as _detached is set to true in the node data.

##### Layout
- The data of a section is an object with any property name. Each proeprty is a array of nodes. The default group name is "_".
- Each node is an object which only has two keys
    - uuid - A string which is the id of the node
    - children - Another object with properties where any property is an array of nodes.

##### Data
- The data of a section is an object which is a normalized list of the uuids defined for each node within that section.
- Each node is an object which can contain any data.
- The data contained in a node has the following restrictions.
    - The key "_ref" must be an objec with two keys
        - uuid - The id of the document being referenced.
        - type - The type of the document being referenced.
    - The key "_detached" must be a boolean value and can only be true if there is no layout representation for this node. Otherwise it must be false || null || undefined and must have a layout representation.
    - The key "_bound" must be a boolean value. The default value is false. If this field is set to true then when this data is removed any section by the same id as the node is removed. Only sections which are immediately child to this nodes section are checked for and removed.

#### issues
This section allow the consuming system to define messages, issues, or validation problems and target a node for this information.

The issues part must mirror the defined sections in the body. Structuraly it also mirrors the data part of the body. The data defined for each node though has no restrictions other than each node in this part must at least be a object. Other this object can contain any key of any type.

### Operational Changes

There are 5 operational changes which can be performed to manipulat any data in this format.

#### Rename
This a change that changes any data in the head section.

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1
        },
        "description": {
            "type": "string",
        },
        "created": {
            "type": "number",
        },
        "updated": {
            "type": "number",
        },
        "version": {
            "type": "string",
            "pattern": "^\\d+\\.\\d+\\.\\d+$"
        }
    }
}
```


#### Insert Item
This message defines data to insert into the body and where to place it in the layout. The uuid in the put property is required except for the last item in the array. If not defined then it is expected that the uuid is defined for the item when it is inserted.

If a group is provided then then the node will be placed in a group in that part of the layout. If not provided or is null then the default group "_" will be used.

If instead of an array as the value of the put property a string can be used. If provided then the data will be created as detached and no layout part will be created.

```json
{
    "definitions": {
        "putItem": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string"
                },
                "index": {
                    "type": "integer"
                },
                "group": {
                    "type": "string"
                }
            },
            "required": [ "uuid" ]
        }
    },
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        },
        "put": {
            "type": ["string", "array"],
            "items": {
                "$ref": "#/definitions/putItem"
            },
            "minLength": 1
        },
        "data": {
            "type": "object",
            "additionalProperties": {
                "type": "any"
            }
        }
    }
}
```

If this node references another document then in the data the key "_ref" must be used and must follow the rules for this key as specified above.

#### Remove Item
This message defines data to remove from the body.

If the put property is an array then each uuid is required as is the index. If a group is provided then then the node will be removed from that group in that part of the layout. If not provided or is null then the default group "_" will be used.

If the put property is a string then it is expected that the data being removed was inserted detached and this data will be removed.

```json
{
    "definitions": {
        "pullItem": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string"
                },
                "index": {
                    "type": "integer"
                },
                "group": {
                    "type": "string"
                }
            },
            "required": [ "uuid" ]
        }
    },
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        },
        "pull": {
            "type": ["string", "array"],
            "items": {
                "$ref": "#/definitions/pullItem"
            },
            "minLength": 1
        }
    }
}
```

If remove is called with a string but the node was inserted into the layout an error will be thrown.

If remove is called with an array and the node is not found anywhere in the layout then an error will be thrown.

If the property being removed has children then then each child will have it's data removed as well.

#### Move Item
This message identifies a node in the layout to move and where to place it. The pull property defines where the node exists in the layout. The uuid in the put property is required except for the last item in the array. In this case the last item cannot have a uuid because the value of the last item in the pull property will be used. Only node inserted into the layout can be moved.

```json
{
    "definitions": {
        "putItem": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string"
                },
                "index": {
                    "type": "integer"
                },
                "group": {
                    "type": "string"
                }
            },
            "required": [ "uuid" ]
        },
        "pullItem": {
            "type": "object",
            "properties": {
                "uuid": {
                    "type": "string"
                },
                "index": {
                    "type": "integer"
                },
                "group": {
                    "type": "string"
                }
            },
            "required": [ "uuid" ]
        }
    },
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        },
        "pull": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/pullItem"
            }
        },
        "put": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/putItem"
            }
        }
    }
}
```

#### Update Item
This message identifies the node which is getting its data updated. The uuid is the id of the node to update and the data property is the data by which to update it with.

```json
{
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        },
        "uuid": {
            "type": "string",
            "minLength": 1
        },
        "data": {
            "type": "object",
            "additionalProperties": {
                "type": "any"
            }
        }
    }
}
```

#### Set an issue for a node
This message identifies the node which is getting issue data applied. The uuid is the id of the node. Data is the issue information which will be stored.

```json
{
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        },
        "uuid": {
            "type": "string",
            "minLength": 1
        },
        "data": {
            "type": "object",
            "additionalProperties": {
                "type": "any"
            }
        }
    }
}
```

#### Define a section
Defines a new section in layout, data, and issues.

```json
{
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        }
    }
}
```

#### Undefine a section
Removed a section in layout, data, and issues.

```json
{
    "type": "object",
    "properties": {
        "section": {
            "type": "string"
        }
    }
}
```

This will remove all the data and sub sections defined in this section.
