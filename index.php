<?php
/**
 * Sciola
 *
 * @version 1.0.0
 */
class Sciola
{
    /**
     * init
     *
     * @access public
     */
    public static function init()
    {
        try {
            $file = dirname(__FILE__) . '/vendor/autoload.php';
            if (file_exists($file)) {
                include_once $file;
                $file = explode('/packages/node_modules/sciola', $file)[0];
                return Sciola\Settings::init($file);
            }
            throw new Exception('Error: The autoload.php file was not found!');
        } catch (Exception $e) {
           echo $e->getMessage();
        }
    }
}
