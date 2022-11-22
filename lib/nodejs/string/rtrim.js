/*
| ------------------------------------------------------------------------------
| Strip characters from the end of a string.
|
| @param {String} str
| @param {String} charlist
| ------------------------------------------------------------------------------
| const string = require("./string");
| var result   = string.rtrim("/text/", "/");
| ------------------------------------------------------------------------------
*/
function rtrim(str, charlist) {
    if (charlist === undefined) {
        charlist = "\s";
    }
    return str.replace(new RegExp("[" + charlist + "]+$"), "");
}
module.exports = rtrim;
