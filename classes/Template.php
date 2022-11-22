<?php
/**
 * Template
 *
 * @version 1.0.7
 */
namespace Sciola;

use \Twig;

class Template
{
    private static $Twig = null;

    /**
     * init
     *
     * @access public
     */
    public static function init() : void
    {
        if (ini_get('display_errors')) {
            $twig_env = ['auto_reload' => true, 'cache' => false];
        } else {
            $twig_env = ['cache' => PATH . '/writable/cache'];
        }
        $TwigLoader = new Twig\Loader\FilesystemLoader(PATH . '/layers/Views');
        $TwigLoader->addPath(PATH . '/packages/node_modules', 'packages');
        self::$Twig = new Twig\Environment($TwigLoader, $twig_env);
        require_once(PATH . '/packages/sciola/twig_filters.php');
        require_once(PATH . '/packages/sciola/twig_functions.php');
    }

    /**
     * render
     *
     * @param string $file
     * @param array $data
     * @access public
     */
    public static function render($file, $data) : void
    {
        $data['CONSTANT'] = CONSTANT;
        $data['header']   = 'Layout/header.html';
        $data['footer']   = 'Layout/footer.html';
        $data['ajax']     = false;
        $headers          = getallheaders();
        if (isset($headers['Ajax'])) {
            $data['ajax'] = true;
        }
        if (pathinfo($file, PATHINFO_EXTENSION)) {
            echo self::$Twig->render("{$file}", $data);
        } else {
            echo self::$Twig->render("{$file}.html", $data);
        }
    }

    /**
     * twigFunction
     *
     * @param string $name
     * @param mixed $fnc
     * @access public
     */
    public static function twigFunction($name, $fnc) : void
    {
        $TwigFunction = new Twig\TwigFunction($name, $fnc);
        self::$Twig->addFunction($TwigFunction);
    }

    /**
     * twigFilter
     *
     * @param string $name
     * @param mixed $fnc
     * @access public
     */
    public static function twigFilter($name, $fnc) : void
    {
        $TwigFilter = new Twig\TwigFilter($name, $fnc);
        self::$Twig->addFilter($TwigFilter);
    }
}