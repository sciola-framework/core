<?php
/**
 * Class StringUtils
 *
 * Usage:
 *
 * $StringUtils = new StringUtils;
 *
 * echo $StringUtils->slice('abc-def', '-', 0); // abc
 * echo $StringUtils->slice('abc-def', '-', 1); // def
 * echo $StringUtils->slice('abc-def', '-', 0, function ($str) {
 *     return $str;
 * }); // abc
 * echo $StringUtils->slice('abc-def', '-', 1, function ($str) {
 *     return $str;
 * }); // def
 *
 * @version 1.0.0
 */
class StringUtils
{
    /**
     * Cut the strings
     *
     * @param string $str
     * @param string $sub
     * @param bool $side
     * @param callback $callback
     * @return string
     * @access public
     */
    public function slice($str, $sub, $side, $callback = null) : string
    {
        if (strpos($str, $sub) !== false) {
            $arr = explode($sub, $str);
            $str = ($side) ? end($arr) : $arr[0];
        }
        return (is_callable($callback)) ? $callback($str) : $str;
    }
}
