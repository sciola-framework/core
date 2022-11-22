/*
| ------------------------------------------------------------------------------
| Deletes files.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const file = require("./file");
| file.remove("/path/to/file");
| ------------------------------------------------------------------------------
*/
function remove(path) {
    const fs = require("fs");
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
module.exports = remove;
