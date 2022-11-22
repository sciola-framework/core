/*
| ------------------------------------------------------------------------------
| JComponent
| ------------------------------------------------------------------------------
*/
class JComponent {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        this.box    = (...args) => new JBox(args);
        this.dialog = new JDialog();
        this.navbar = () => new JNavbar();
        this.icon   = name => this.dialog.icon(name);
    }
}
