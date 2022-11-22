/*
| ------------------------------------------------------------------------------
| Lists all directories within a directory.
|
| @param {String} path
| ------------------------------------------------------------------------------
| const directory = require("./directory");
| var directories = directory.list("/path/to/directory");
| ------------------------------------------------------------------------------
*/
function list(path) {
    const fs = require("fs");
    return fs.readdirSync(path).filter(file => {
        return fs.statSync(path + "/" + file).isDirectory();
    });
}
module.exports = list;
