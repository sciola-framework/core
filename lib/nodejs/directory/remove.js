/*
| ------------------------------------------------------------------------------
| Remove directory recursively.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| directory.remove("/path/to/directory");
| ------------------------------------------------------------------------------
*/
function remove(path) {
    const rimraf = require("rimraf");
    const fs     = require("fs");
    if (fs.existsSync(path)) {
        rimraf.sync(path);
    }
}
module.exports = remove;
