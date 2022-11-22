/*
| ------------------------------------------------------------------------------
| Strip characters from the beginning of a string.
|
| @param {String} str
| @param {String} charlist
| ------------------------------------------------------------------------------
| const string = require("./string");
| var result   = string.ltrim("/text/", "/");
| ------------------------------------------------------------------------------
*/
function ltrim(str, charlist) {
    if (charlist === undefined) {
        charlist = "\s";
    }
    return str.replace(new RegExp("^[" + charlist + "]+"), "");
}
module.exports = ltrim;
