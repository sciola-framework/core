<?php
/**
 * Sciola
 *
 * @version 1.0.2
 */
class Sciola
{
    /**
     * index
     *
     * @param string $path
     * @access public
     */
    public static function index($path)
    {
        if (is_file($path . '/public' . $_SERVER['REQUEST_URI'])) return false;
        self::autoload($path);
    }

    /**
     * autoload
     *
     * @param string $path
     * @access private
     */
    private static function autoload($path)
    {
        try {
            $file = dirname(__FILE__) . '/vendor/autoload.php';
            if (file_exists($file)) {
                include_once $file;
                $file = "$path/packages/vendor/autoload.php";
                if (file_exists($file)) {
                    include_once $file;
                }
                return Sciola\Settings::init($path);
            }
            throw new Exception('Error: The autoload.php file was not found!');
        } catch (Exception $e) {
           echo $e->getMessage();
        }
    }
}
