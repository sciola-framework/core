/*
| ------------------------------------------------------------------------------
| Shell
| ------------------------------------------------------------------------------
| const $Shell = new Shell();
| $Shell.execute("ls");
| $Shell.msgbox("Message...", "success");
| $Shell.status(3000, "online");
| ------------------------------------------------------------------------------
*/
class Shell {

    /**
     * Execute Shell commands.
     *
     * @param {String} cmd
     * @access public
     */
    execute(cmd) {
        const child_process = require("child_process");
        return child_process.execSync(cmd).toString();
    }

    /**
     * Displays message box.
     *
     * @param {String} message
     * @param {String} type [ info | success | warning | danger ]
     * @access public
     */
    msgbox(message, type) {
        const output = this.execute(
        "bash " + __dirname + "/sh/msgbox.sh '" + message + "' --" + type);
        console.info(output);
    }

    /**
     * Shows the status of the port in a message box.
     *
     * @param {Integer} port
     * @param {String} option [ online | offline ]
     * @access public
     */
    status(port, option) {
        const output = this.execute(
        "bash " + __dirname + "/sh/status.sh " + port + " --" + option);
        console.info(output);
    }
}
