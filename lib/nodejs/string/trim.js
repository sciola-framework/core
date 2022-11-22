/*
| ------------------------------------------------------------------------------
| Strip characters from the beginning and end of a string.
|
| @param {String} str
| @param {String} charlist
| ------------------------------------------------------------------------------
| const string = require("./string");
| var result   = string.trim("/text/", "/");
| ------------------------------------------------------------------------------
*/
function trim(str, charlist) {
    const string = require("./index");
    str = string.ltrim(str, charlist);
    str = string.rtrim(str, charlist);
    return str;
}
module.exports = trim;
