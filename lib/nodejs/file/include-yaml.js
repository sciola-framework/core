/*
| ------------------------------------------------------------------------------
| Includes yaml file.
|
| @param {String} file
| ------------------------------------------------------------------------------
| const file = require("./file");
| var result = file.include_yaml("/path/to/file.yaml");
| ------------------------------------------------------------------------------
*/
function include_yaml(file) {
    const fs   = require("fs");
    const yaml = require("js-yaml");
    return yaml.safeLoad(fs.readFileSync(file, "utf8"));
}
module.exports = include_yaml;
