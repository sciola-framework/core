/*
| ------------------------------------------------------------------------------
| JEvent
| ------------------------------------------------------------------------------
*/
class JEvent {

    /**
     * Attach an event handler function to the selected elements.
     *
     * on("click", "#id", function (e) {
     *
     * });
     *
     * @param {String} event
     * @param {String} selector
     * @param {Callback} callback
     * @access public
     */
    on(event, selector, callback) {
        $(document).on(event, selector, function (e) {
            callback(e);
        });
    }
}
