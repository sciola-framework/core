class Sciola {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        window.$_      = [];
        window.global  = window;
        global.type_of = obj => Object.prototype
                                      .toString
                                      .call(obj)
                                      .slice(8, -1)
                                      .toLowerCase();
        if (!window["module"]) {
            global.module  = {};
            module.exports = null;
        }
    }

    /**
     * Initialization
     *
     * @access public
     */
    init() {
        $_["document"]  = new JDocument();
        $_["http"]      = new JHttp();
        $_["file"]      = new JFile();
        $_["language"]  = new JLanguage();
        $_["element"]   = new JElement();
        $_["event"]     = new JEvent();
        $_["time"]      = new JTime();
        $_["component"] = new JComponent();
        $_["document"].ready(function () {
            $_["component"].navbar();
            $_["component"].navbar().effect("dark-to-light");
        });
        $_["document"].ready(function () {
            $("[onload]").trigger("onload");
        });
    }
}
