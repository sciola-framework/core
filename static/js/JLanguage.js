/*
| ------------------------------------------------------------------------------
| JLanguage
| ------------------------------------------------------------------------------
*/
class JLanguage {

    /**
     * Return translation data via sessionStorage
     *
     * cache("language"); // cache("pt-BR");
     *
     * @param {String} language
     * @access private
     */
    cache(language) {
        return JSON.parse(sessionStorage.getItem(language)) || {};
    }

    /**
     * Return the translation
     *
     * translate("Text...");
     *
     * @param {String} text
     * @access public
     */
    translate(text) {
        var language = this.cache($_["document"].lang);
        return language[text] ? language[text] : text;
    }

    /**
     * Returns the translation of the route.
     *
     * translate_route({language: "pt-BR", path: "/path"});
     *
     * @param {Object} route
     * @access private
     */
    translate_route(route) {
        Object.prototype.getKey = function (value) {
            for (let key in this) {
                if (this[key] == value) {
                    return key;
                }
            }
            return "";
        };
        var translation = path => {
            return this.cache(route.language)[path] ||
                   this.cache($_["document"].lang).getKey(path);
        };
        var arr = route.path.split("/");
        var len = arr.length;
        if (arr[1]) {
            route.path = "";
            for (let i=0; i<=len; i++) {
                if (arr[i]) {
                    route.path += "/" + (translation(arr[i]) || arr[i]);
                }
            }
            return route.path;
        }
        return translation(route.path) || route.path;
    }

    /**
     * Change language
     *
     * @param {String} language
     * @access public
     */
    change(language) {
        if (language !== "en" && sessionStorage.getItem(language) === null) {
            // $_GET['lang'] - /sciola/classes/Language.php
            $_["http"].request("/?lang=" + language, (error, response) => {
                sessionStorage.setItem(language, JSON.stringify(response.data));
                return this.change(language);
            });
        }
        // $_GET['language'] - /sciola/classes/Settings.php
        $_["http"].request("/?language=" + language, (error, response) => {
            if (error) {
                console.log(error);
            }
            window.location.href = this.translate_route({
              language: language,
              path: window.location.pathname.substring(1)
            });
        });
    }
}
