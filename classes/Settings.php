<?php
/**
 * Settings
 *
 * @version 1.0.8
 */
namespace Sciola;

class Settings
{
    /**
     * init
     *
     * @param string $path
     * @return void
     * @access public
     */
    public static function init($path) : void
    {
        session_start();
        define('PATH', $path);
        self::php();
        self::sciola();
        self::constant();
        if (SCIOLA['DEV_MODE']) {
            error_reporting(E_ALL);
            ini_set('display_errors', '1');
        } else {
            error_reporting(0);
            ini_set('display_errors', '0');
        }
        require_once(PATH . '/packages/sciola/wrappers.php');
        Language::init();
        Template::init();
        Route::init();
    }

    /**
     * php
     *
     * @access private
     */
    private static function php()
    {
        $list = parse_ini_file(PATH . '/config/php.ini', true)['PHP'];
        foreach ($list as $key => $value) {
            ini_set($key, $value);
        }
    }

    /**
     * constant
     *
     * @return void
     * @access private
     */
    private static function constant() : void
    {
        define('CONSTANT', parse_ini_file(PATH . '/config/constant.ini', true));
    }

    /**
     * Sciola Framework Settings.
     *
     * @return void
     * @access private
     */
    private static function sciola() : void
    {
        define('SCIOLA', parse_ini_file(PATH . '/config/sciola.ini', true));
    }

    /**
     * language
     *
     * @return string
     * @access public
     */
    public static function language() : string
    {
        if (!isset($_SESSION['language'])) {
            $_SESSION['language'] = 'en';
        } else if (isset($_GET['language'])) {
            $_SESSION['language'] = $_GET['language'];
        }
        return $_SESSION['language'];
    }

    /**
     * Host
     *
     * @param bool $use_forwarded_host
     * @return string
     * @access public
     */
    public static function host($use_forwarded_host = false) : string
    {
        $s    = $_SERVER;
        $ssl  = (! empty($s['HTTPS']) && $s['HTTPS'] == 'on');
        $sp   = strtolower($s['SERVER_PROTOCOL']);
        $prot = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        $port = $s['SERVER_PORT'];
        $port = ((! $ssl && $port == '80') || ($ssl && $port == '443')) ? '' :
                ':' . $port;
        $host = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ?
                 $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ?
                 $s['HTTP_HOST'] : null);
        $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
        return "$prot://$host";
    }

    /**
     * PHP version comparison
     *
     * @param string $version
     * @param string $op
     * @return bool
     * @access public
     */
    public static function phpcompare($version, $op) : bool
    {
        if (version_compare(phpversion(), $version, $op)) {
            return true;
        } else {
            return false;
        }
    }
}
