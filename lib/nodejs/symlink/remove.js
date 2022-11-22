/*
| ------------------------------------------------------------------------------
| Deletes the symbolic link.
|
| @param {String} link
| ------------------------------------------------------------------------------
| const symlink = require("./symlink");
| symlink.remove("/path/to/link");
| ------------------------------------------------------------------------------
*/
function remove(link) {
    const fs = require("fs");
    try {
        if (fs.lstatSync(link).isSymbolicLink()) {
            fs.unlinkSync(link);
            if (!fs.existsSync(link)) {
                return true; // Successfully deleted.
            } else {
                return false; // Error while deleting.
            }
        }
    } catch (e) {
        return false;
    }
}
module.exports = remove;
