/*
| ------------------------------------------------------------------------------
| Create file.
|
| @param {String} path
| @param {String} data
| @param {String} charset
| ------------------------------------------------------------------------------
| const file = require("./file");
| file.create("/path/to/file", "Data...");
| ------------------------------------------------------------------------------
*/
function create(path, data, charset = "utf8") {
    try {
        const fs = require("fs");
        fs.writeFileSync(path, data, charset);
        if (fs.existsSync(path)) {
            return true; // Successfully created file.
        } else {
            return false; // Error creating file.
        }
    } catch(e) {
        return false;
    }
}
module.exports = create;
