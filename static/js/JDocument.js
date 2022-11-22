/*
| ------------------------------------------------------------------------------
| JDocument
| ------------------------------------------------------------------------------
*/
class JDocument {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        this.doc        = document;
        this.doc.lang   = this.doc.documentElement.lang;
        this.doc.ready  = callback => this.ready(callback);
        this.doc.on     = (event, callback) => this.on(event, callback);
        this.doc.html   = data => this.html(data);
        this.doc.height = () => this.height();
        this.doc.width  = () => this.width();
        this.doc.error  = () => this.error(callback);
        return this.doc;
    }

    /**
     * DOM content loaded
     *
     * ready(function (e) {
     *
     * });
     *
     * @param {Callback} callback
     * @access public
     */
    ready(callback) {
        this.doc.addEventListener("DOMContentLoaded", function (e) {
            callback(e);
        });
    }

    /**
     * Add event listener
     *
     * on("click", function (e) {
     *
     * });
     *
     * @param {String} event
     * @param {Callback} callback
     * @access public
     */
    on(event, callback) {
        this.doc.addEventListener(event, function (e) {
            callback(e);
        });
    }

    /**

     * Overwrite current document with HTML data
     *
     * @param {String} data
     * @access public
     */
    html(data) {
        this.doc.documentElement.innerHTML = data;
    }

    /**
     * Get document height
     *
     * @access public
     */
    height() {
        return window.innerHeight ||
        this.doc.documentElement.clientHeight ||
        this.doc.body.clientHeight ||
        this.doc.body.offsetHeight;
    }

    /**
     * Get document width
     *
     * @access public
     */
    width() {
        return window.innerWidth ||
        this.doc.documentElement.clientWidth ||
        this.doc.body.clientWidth ||
        this.doc.body.offsetWidth;
    }

    /**
     * Error information
     *
     * error(function (info) {
     *     // info.message | info.file | info.line | info.col | info.error
     *     console.log(info);
     * });
     *
     * @param {Callback} callback
     * @access public
     */
    error(callback) {
        window.onerror = function (message, file, line, col, error) {
            let info     = {};
            info.message = message;
            info.file    = file;
            info.line    = line
            info.col     = col;
            info.error   = error;
            return callback(info);
        };
    }
}
