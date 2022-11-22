/*
| ------------------------------------------------------------------------------
| Create a symbolic link.
|
| @param {String} path
| @param {String} link
| ------------------------------------------------------------------------------
| const symlink = require("./symlink");
| symlink.create("/path/to/origin", "/path/to/destiny");
| ------------------------------------------------------------------------------
*/
function create(path, link) {
    const fs = require("fs");
    try {
        if (fs.existsSync(path) && !fs.existsSync(link)) {
            fs.symlink(path, link, "dir", err => {
                if (fs.existsSync(link)) {
                    return true; // Successfully created.
                } else if (err) {
                    return false; // Error creating.
                }
            });
        }
    } catch (e) {
        return false;
    }
}
module.exports = create;
