<?php
/**
 * Settings
 *
 * @version 1.1.7
 */
namespace Sciola;

class Settings
{
    /**
     * init
     *
     * @return void
     * @access public
     */
    public static function init() : void
    {
        self::php();
        self::autoloader();
        self::constant();
        if (self::dev()) {
            error_reporting(E_ALL);
            ini_set('display_errors', '1');
        } else {
            error_reporting(0);
            ini_set('display_errors', '0');
        }
        require_once(PATH['core'] . '/wrappers.php');
        Language::init();
        Template::init();
        Route::init();
    }

    /**
     * Autoloader
     *
     * @return void
     * @access private
     */
    private static function autoloader() : void
    {
        $ns = parse_ini_file(PATH['app'] . '/config/namespace.ini', true);
        define('NS', $ns);

        $Psr4AutoloaderClass = new Psr4AutoloaderClass;
        $Psr4AutoloaderClass->register();
        $Psr4AutoloaderClass->addNamespace(NS['controller'],
                                           PATH['controllers']);
        $Psr4AutoloaderClass->addNamespace(NS['model'],
                                           PATH['models']);
        $Psr4AutoloaderClass->addNamespace(NS['libraries'],
                                           PATH['libraries']);
    }

    /**
     * php
     *
     * @access private
     */
    private static function php()
    {
        ini_set('session.gc_probability', 1);
        $list = parse_ini_file(PATH['app'] . '/config/php.ini', true)['PHP'];
        foreach ($list as $key => $value) {
            ini_set($key, $value);
        }
        session_start();
    }

    /**
     * constant
     *
     * @return void
     * @access private
     */
    private static function constant() : void
    {
        define('CONSTANT',
        parse_ini_file(PATH['app'] . '/config/constant.ini', true));
    }

    /**
     * Development environment settings.
     *
     * @return void
     * @access private
     */
    private static function dev() : bool
    {
        return parse_ini_file(PATH['app'] . '/config/dev.ini', true)['debug'];
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
     * PHP version comparison.
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
        }
        return false;
    }
}
