/*
| ------------------------------------------------------------------------------
| Check if file exists.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const file = require("./file");
| if (file.exists("/path/to/file")) {
|
| }
| ------------------------------------------------------------------------------
*/
function exists(path) {
    try {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return true;
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = exists;
