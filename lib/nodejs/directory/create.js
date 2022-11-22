/*
| ------------------------------------------------------------------------------
| Create directory recursively.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| directory.create("/path/to/directory");
| ------------------------------------------------------------------------------
*/
function create(path) {
    const fs = require("fs");
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
          recursive: true
        });
    }
}
module.exports = create;
