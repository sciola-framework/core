/*
| ------------------------------------------------------------------------------
| JLanguage
| ------------------------------------------------------------------------------
*/
class JLanguage {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        var doc_lang = $_["document"].lang; // <html lang="en">
        if (doc_lang !== "en" &&
            sessionStorage.getItem(doc_lang) === null) {
            $_["http"].request("/?i18n=" + doc_lang, (error, response) => {
                sessionStorage.setItem(doc_lang, JSON.stringify(response.data));
            });
        }
    }

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
        var url       = window.location.pathname.substring(1);
        var translate = this.cache(language);
        // $_GET['language'] - /libraries/Settings.php
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
