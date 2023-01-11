<?php
/**
 * Sciola
 *
 * @version 1.0.5
 */
class Sciola
{
    /**
     * index
     *
     * @param string $app
     * @param array $path
     * @access public
     */
    public static function index($app, $path)
    {
        foreach ($path as $key => $value) {
            $path[$key] = $app . $path[$key];
        }
        $path["app"]  = $app;
        $path["core"] = dirname(__FILE__);
        define('PATH', $path);
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
            $file = PATH['core'] . '/vendor/autoload.php';
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
