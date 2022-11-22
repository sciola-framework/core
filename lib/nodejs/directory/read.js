/*
| ------------------------------------------------------------------------------
| Read directory.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| var result = directory.read("/path/to/directory");
| ------------------------------------------------------------------------------
*/
function read(path) {
    try {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return fs.readdirSync(path);
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = read;
