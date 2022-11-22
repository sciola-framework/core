/*
| ------------------------------------------------------------------------------
| JElement
| ------------------------------------------------------------------------------
*/
class JElement {

    /**
     * Returns the element reference through its ID
     *
     * id("foo");
     *
     * @param {String} name
     * @access public
     */
    id(name) {
        return document.getElementById(name);
    }

    /**
     * Resize element height
     *
     * resize(this);
     *
     * @param {Object} element
     * @access public
     */
    resize(element) {
        var obj = element.contentWindow.document;
        element.style.height = obj.documentElement.scrollHeight + "px";
    }
}
