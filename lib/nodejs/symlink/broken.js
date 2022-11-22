/*
| ------------------------------------------------------------------------------
| Check if the symbolic link is broken.
|
| @param {String} link
| ------------------------------------------------------------------------------
| const symlink = require("./symlink");
| if (symlink.broken("/path/to/link")) {
|
| }
| ------------------------------------------------------------------------------
*/
function broken(link) {
    try {
        const fs = require("fs");
        if (!fs.existsSync(link) && fs.lstatSync(link).isSymbolicLink()) {
            return true;
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = broken;
