/*
| ------------------------------------------------------------------------------
| Format the string to snake_case.
|
| @param {String} str
| ------------------------------------------------------------------------------
| const string = require("./string");
| var result   = string.snake_case("TypeOfData.AlphaBeta");
| ------------------------------------------------------------------------------
*/
function snake_case(str) {
    return str.replace(/\.?([A-Z])/g, s => {
            return "_" + s.toLowerCase();
    }).replace(/^_/, "");
}
module.exports = snake_case;
