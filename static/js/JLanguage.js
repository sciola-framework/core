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
        var url       = window.location.pathname.substring(1);
        var translate = this.cache(language);
        // $_GET['language'] - /sciola/classes/Settings.php
        $_["http"].request("/?language=" + language, (error, response) => {
            if (error) {
                console.log(error);
            }
            Object.prototype.getKey = function (value) {
                for (var key in this) {
                    if (this[key] == value) {
                        return key;
                    }
                }
                return "";
            };
            window.location.href = translate[url] ||
                                   this.cache($_["document"].lang).getKey(url);
        });
    }
}
