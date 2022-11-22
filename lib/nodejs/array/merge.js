/*
| ------------------------------------------------------------------------------
| Merge two vectors.
|
| @param {Array} arr1
| @param {Array} arr2
| ------------------------------------------------------------------------------
| const array  = require("./array");
| const result = array.merge(arr1, arr2);
| ------------------------------------------------------------------------------
*/
function merge(arr1, arr2) {
    const assoc = {},
          arr   = arr1.slice(0);
    let len1    = arr1.length,
        len2    = arr2.length,
        index   = 0;
    while (len1--) {
        assoc[arr1[len1]] = null;
    }
    while (len2--) {
        let itm = arr2[index];
        if (assoc[itm] === undefined) { // Eliminate the indexOf call
            arr.push(itm);
            assoc[itm] = null;
        }
        index++;
    }
    return arr;
}
module.exports = merge;
