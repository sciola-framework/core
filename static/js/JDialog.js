/*
| ------------------------------------------------------------------------------
| JDialog
| ------------------------------------------------------------------------------
*/
class JDialog {

    /**
     * Alert
     *
     * alert("Message..."); // Optional callback
     * alert("Message...", event => {
     *
     * });
     *
     * @param {String} message
     * @param {Function} callback
     * @access public
     */
    alert(message, callback = null) {
        let options = {
            centerVertical: true,
            closeButton: false,
            message: message,
            buttons: {
                ok: {
                    label: this.icon("close") + " " +
                           $_["language"].translate("Close"),
                    className: "btn-secondary"
                }
            }
        };
        if (callback !== null) {
            options.callback = event => callback(event)
        }
        bootbox.alert(options);
    }

    /**
     * Confirm
     *
     * confirm("Message...", event => {
     *
     * });
     *
     * @param {String} message
     * @param {Function} callback
     * @access public
     */
    confirm(message, callback) {
        bootbox.confirm({
            centerVertical: true,
            closeButton: false,
            message: message,
            buttons: {
                cancel: {
                    label: this.icon("close") + " " +
                           $_["language"].translate("Cancel"),
                    className: "btn-danger"
                },
                confirm: {
                    label: this.icon("check") + " " +
                           $_["language"].translate("Confirm"),
                    className: "btn-success"
                }
            },
            callback: event => callback(event)
        });
    }

    /**
     * Icon
     *
     * Returns the HTML <i></i> tag with the icon class
     *
     * this.icon("icon-name", "size");
     * size: xs | sm | lg | 2x | 3x | 4x | 5x | 6x | 7x | 8x | 9x | 10x
     *
     * @param {String} name
     * @param {String} size
     * @access public
     */
    icon(name, size = null) {
        size = (size) ? " fa-" + size : "";
        const icon = {
            "success": "fas fa-check-circle text-success",
            "info": "fas fa-info-circle text-info",
            "warning": "fa fa-exclamation-triangle text-warning",
            "danger": "fas fa-times-circle text-danger",
            "close": "fa fa-times-circle",
            "plus": "fa fa-plus",
            "edit": "fa fa-edit",
            "trash": "fa fa-trash",
            "check": "fa fa-check",
            "search": "fa fa-search",
            "square": "fas fa-square",
            "check-square": "fas fa-check-square"
        };
        return `<i class="${icon[name]}${size} me-2"></i>`;
    }
}
