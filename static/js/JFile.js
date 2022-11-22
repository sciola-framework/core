/*
| ------------------------------------------------------------------------------
| JFile
| ------------------------------------------------------------------------------
*/
class JFile {

    /**
     * Include .js file
     *
     * include("path/file.js");
     * include(["path/file1.js", "path/file2.js", "path/file3.js"]);
     *
     * @param {Array|String} src
     * @access public
     */
    include(src) {
        if (type_of(src) === "string") {
            var script   = document.createElement("script");
            script.type  = "text/javascript";
            script.src   = src;
            script.async = true;
            document.getElementsByTagName("head")[0].appendChild(script);
        } else if (type_of(src) === "array") {
            this.includeMulti(src);
        }
    }

    /**
     * Include multiple .js files
     *
     * @param {Array} arr
     * @access private
     */
    includeMulti(arr) {
        var attr = [];
        var file = "";
        $("head script").each(function (i) {
            attr[i] = $(this).attr("src");
        });
        $(arr).each((index, path) => {
            file = path;
            $(attr).each((i, src) => {
                if (path === src) {
                    file = "";
                    return false;
                }
            });
            if (file !== "") {
                this.include(file);
            }
        });
    }
}
