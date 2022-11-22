/*
| ------------------------------------------------------------------------------
| Check if there is a symbolic link.
|
| @param {String} link
| ------------------------------------------------------------------------------
| const symlink = require("./symlink");
| if (symlink.exists("/path/to/link")) {
|
| }
| ------------------------------------------------------------------------------
*/
function exists(link) {
    try {
        const fs = require("fs");
        if (fs.existsSync(link) && fs.lstatSync(link).isSymbolicLink()) {
            return true;
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = exists;
