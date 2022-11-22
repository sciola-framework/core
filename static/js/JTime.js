/*
| ------------------------------------------------------------------------------
| JTime
| ------------------------------------------------------------------------------
*/
class JTime {

    /**
     * Pause script execution
     *
     * sleep(5); // 5 seconds
     *
     * @param {Number} second
     * @access public
     */
    sleep(second) {
        second = new Date().getTime() + (second * 1000);
        while(new Date().getTime() < second) {}
    }
}
