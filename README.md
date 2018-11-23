# JSON Editor

## Why 

Other JSON editors felt "not simple enough", considering the typical workflow of editing a JSON document.

## How 

JSON Editor loads and parses a JSON document into an object. That object is passed into a callback handler provided 
by the caller. The return value of the callback handler will be serialized and written to the original file.

## Example 

We will overwrite the value of "message" in the 2nd array item to "baz":

### ../path/to.json

    [
      {
        "message": "foo"
      },
      {
        "message": "bar"
      }
    ]


### index.js
    
    const { JsonEditor } from 'json-editor';

    const je = new JsonEditor('../path/to.json');

    (async function() {
      // .edit will pass the parsed JSON to the callback. 
      // This method will always attempt to write the serialized return value
      // to the file.
      await je.edit(jsonObj => {
        jsonObj[1].message = "baz";

        return jsonObj;
      });

      // If you do not need to write to the file, use .readyonly instead.
      await je.readonly(jsonObj => console.log(jsonObj));
    })();

