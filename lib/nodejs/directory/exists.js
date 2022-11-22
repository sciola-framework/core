/*
| ------------------------------------------------------------------------------
| Check if directory exists.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| if (directory.exists("/path/to/directory")) {
|
| }
| ------------------------------------------------------------------------------
*/
function exists(path) {
    try {
        const fs = require("fs");
        if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
            return true;
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = exists;
