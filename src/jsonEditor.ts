/**
 * @author Patrick Gunsolley <patrick.gunsolley@outlook.com>
 */

import * as fs from 'fs';

/**
 * JsonEditor - allows for efficient JSON editing.
 */
export class JsonEditor {
  
  /**
   * The initializer requires the path to the json file.
   * 
   * @param _path 
   */
  constructor(private _path: string = "") {
    if (_path === "") {
      throw new Error('A path is required');
    }
  }

  /**
   * Reads the json file, and parses it into an anonymous object.
   * 
   * @returns a promise
   */
  private _read(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      fs.readFile(this._path, (err, data) => {
        if (err) return reject(new Error(err.message));
        let parsed;
        try {
          parsed = JSON.parse(data.toString());
        } catch(err) {
          return reject(new Error(err));
        }
        resolve(parsed);
      });
    });
  }

  /**
   * Parse the JSON into an object, pass it into the callback handler, but 
   * the callback return value is not written to the JSON file.
   * 
   * @method 
   */
  readonly(handler: (parsed: object) => object): Promise<object> {
    return this._read().then(handler);
  }

  /**
   * The parsed json object is passed into a callback handler. 
   * The return value of the callback will be serialized and written to the
   * JSON file. All changes will overwrite the original JSON file, so use caution
   * when editing the object.
   * 
   * It's important to note that this method will always finish by writing to the 
   * fs. If you do not need to write to the fs, 
   * you should call JsonEditor.prototype.readonly instead.
   * 
   * @method
   * @param handler 
   */
  edit(handler: (parsed: object) => object): Promise<object> {
    return this._read().then((parsed: object) => {
      let modified = handler(parsed);
     
      if (modified !== undefined && typeof modified === 'object')
        return this._write(modified);
      
      // Is this still needed?
      throw new Error('Invalid or unsafe object returned by handler');
    });
  }

  /**
   * Stringify and overwrite the json file with the string.
   * 
   * @private 
   * @method
   * @param obj 
   */
  private _write(obj: object): Promise<object> {
    return new Promise((resolve, reject) => {
      let json;
      try {
        json = JSON.stringify(obj, null, 2);
      } catch(err) {
        return reject(err);
      }
      fs.writeFile(this._path, json, err => err ? reject(err) : resolve(obj));
    });
  }
}

