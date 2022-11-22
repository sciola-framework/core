/*
| ------------------------------------------------------------------------------
| Require directory.
|
| @param {String} path
| @param {Object} options
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| var result = directory.require("/path/to/directory", {});
| ------------------------------------------------------------------------------
*/
module.exports = (path, options = {}) => {
    const require_dir = require("require-dir");
    return require_dir(path, options);
};
