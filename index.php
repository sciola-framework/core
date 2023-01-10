<?php
/**
 * Sciola
 *
 * @version 1.0.3
 */
class Sciola
{
    /**
     * index
     *
     * @param string $app
     * @access public
     */
    public static function index($app)
    {
        $path = parse_ini_file("$app/config/path.ini", true);
        foreach ($path as $key => $value) {
            $path[$key] = $app . $path[$key];
        }
        $path["app"] = $app;
        define('PATH', $path);
        if (is_file(PATH['public'] . $_SERVER['REQUEST_URI'])) {
            return false;
        }
        self::autoload();
    }

    /**
     * autoload
     *
     * @access private
     */
    private static function autoload()
    {
        try {
            $file = dirname(__FILE__) . '/vendor/autoload.php';
            if (file_exists($file)) {
                include_once $file;
                $file = PATH['vendor'] . '/autoload.php';
                if (file_exists($file)) {
                    include_once $file;
                }
                return Sciola\Settings::init();
            }
            throw new Exception('Error: The autoload.php file was not found!');
        } catch (Exception $e) {
           echo $e->getMessage();
        }
    }
}
