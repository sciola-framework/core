<?php
/**
 * Language
 *
 * @version 1.0.6
 */
namespace Sciola;

use \Twig;

class Language
{
    private static $language = [];

    /**
     * init
     *
     * @return void
     * @access public
     */
    public static function init() : void
    {
        if (isset($_GET['i18n'])) {
            $file = PATH . '/writable/cache/' . $_GET['i18n'] . '.json';
            if (file_exists($file)) {
                header('Content-Type: application/json; charset=utf-8');
                include_once($file);
                exit;
            }
        }
        self::cache(Settings::language());
    }

    /**
     * generate
     *
     * @param string $file
     * @return void
     * @access private
     */
    private static function generate($file) : void
    {
        $data        = [];
        $arr['en']   = [];
        $arr['lang'] = [];
        $dir = PATH . '/languages/en/*.json';
        foreach (glob($dir) as $_file) {
            $arr['en'] += json_decode(file_get_contents($_file), true);
        }
        $dir = PATH . '/languages/' . Settings::language() . '/*.json';
        foreach (glob($dir) as $_file) {
            $arr['lang'] += json_decode(file_get_contents($_file), true);
        }
        foreach ($arr['lang'] as $key => $value) {
            if (isset($arr['en'][$key])) {
                $data[$arr['en'][$key]] = $value;
            }
        }
        file_put_contents($file, json_encode($data));
    }

    /**
     * cache
     *
     * @param string $selected_lang
     * @return void
     * @access private
     */
    private static function cache($selected_lang) : void
    {
        $file = PATH . "/writable/cache/$selected_lang.json";
        if (!file_exists($file) && $selected_lang !== 'en') {
            self::generate($file);
        } elseif ($selected_lang !== 'en') {
            if (ini_get('display_errors')) {
                self::generate($file);
            }
            self::$language = json_decode(file_get_contents($file), true);
        }
    }

    /**
     * translate
     *
     * @param string $text
     * @return string
     * @access public
     */
    public static function translate($text) : string
    {
        $text = (string) $text;
        if (Settings::language() && isset(self::$language[$text])) {
            return self::$language[$text];
        }
        return $text;
    }
}
