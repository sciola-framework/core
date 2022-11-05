<?php
/**
 * Layer
 *
 * @version 1.0.2
 */
namespace Sciola;

class Layer
{
    /**
     * instance
     *
     * @param string $ns
     * @param string $_class
     * @return object
     * @access private
     */
    private static function instance($ns, $_class) : object
    {
        $_class = "{$ns}\\" . str_replace('/', '\\', $_class);
        return new $_class;
    }

    /**
     * controller
     *
     * @param string $_class
     * @return object
     * @access public
     */
    public static function controller($_class) : object
    {
        return self::instance('Layers\Controllers', $_class);
    }

    /**
     * model
     *
     * @param string $_class
     * @return object
     * @access public
     */
    public static function model($_class) : object
    {
        return self::instance('Layers\Models', $_class);
    }

    /**
     * view
     *
     * @param string $file
     * @param array $data
     * @access public
     */
    public static function view($file, $data = []) : void
    {
        Template::render($file, $data);
    }
}
