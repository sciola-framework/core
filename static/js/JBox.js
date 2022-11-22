/*
| ------------------------------------------------------------------------------
| JBox
| ------------------------------------------------------------------------------
*/
class JBox {

    /**
     * Class constructor
     *
     * @param {Array} args
     * @access public
     */
    constructor(args) {
        return this.box(args[0], args[1], args[2], args[3], args[4]);
    }

    /**
     * Message box
     *
     * box("Text...", "Background color", "Close button", "CSS classes", "ID");
     *
     * Background color:
     * primary | secondary | success | danger | warning | info | light | dark
     *
     * Close button: true | false
     *
     * ID: ID of the element where the message box will be displayed.
     *
     * Demo:
     *
     * box("Text...", "primary");
     * box("Text...", "primary", true);
     * box("Text...", "primary", true, "m-2 p-2 shadow");
     *
     * Optional ID:
     *
     * box("Text...", "primary", true, "m-2 p-2 shadow", "#myid");
     * HTML: <span id="myid"></span>
     * -------------------------------------------------------------------------
     *
     * @param {String} text
     * @param {String} bgcolor
     * @param {Boolean} btnclose
     * @param {String} css
     * @param {String} id
     * @access public
     */
    box(text, bgcolor = "primary", btnclose = false, css = "", id = "#box") {
        $_["element"].id(id.split("#")[1]).innerHTML = '<div class="alert '    +
        'alert-' + bgcolor + ' alert-dismissible fade show m-0 ' + css + '" '  +
        'role="alert"><span class="text-wrap">' + text + '</span>' + (btnclose ?
        '<button type="button" class="btn-close outline-none box-shadow-none"' +
        ' data-bs-dismiss="alert"></button>' : '') + '</div>';
    }
}
