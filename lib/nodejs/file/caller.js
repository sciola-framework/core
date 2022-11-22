/*
| ------------------------------------------------------------------------------
| Get caller file.
| ------------------------------------------------------------------------------
| const file = require("./file");
| var result = file.caller();
| ------------------------------------------------------------------------------
*/
function caller() {
    var original_func = Error.prepareStackTrace;
    var caller_file;
    try {
        var err = new Error();
        var current_file;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        current_file = err.stack.shift().getFileName();
        while (err.stack.length) {
            caller_file = err.stack.shift().getFileName();
            if(current_file !== caller_file) break;
        }
    } catch (e) {}
    Error.prepareStackTrace = original_func; 
    return caller_file;
}
module.exports = caller;
