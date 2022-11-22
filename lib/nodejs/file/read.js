/*
| ------------------------------------------------------------------------------
| Read file.
|
| @param {String} path
| @param {String} charset
| ------------------------------------------------------------------------------
| const file = require("./file");
| var result = file.read("/path/to/file");
| ------------------------------------------------------------------------------
*/
function read(path, charset = "utf8") {
    try {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, charset);
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}
module.exports = read;
