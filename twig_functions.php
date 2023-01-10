<?php
/*
| ------------------------------------------------------------------------------
| Get base route
| ------------------------------------------------------------------------------
| {{ base_route('/my/route') }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('base_route', function ($route) {
    return Sciola\Route::base($route);
});
/*
| ------------------------------------------------------------------------------
| Message box
| ------------------------------------------------------------------------------
| {{ box('Text...', 'Background color', 'Close button', 'CSS classes') }}
|
| Background color:
| primary | secondary | success | danger | warning | info | light | dark
| Close button: true | false
|
| Demo:
|
| {{ box('Text...', 'primary') }}
| {{ box('Text...', 'primary', true) }}
| {{ box('Text...', 'primary', true, 'm-2 p-2 shadow') }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('box',
function ($text, $bgcolor, $btnclose = false, $css = '') {
    echo '<div class="alert alert-', $bgcolor, ' alert-dismissible fade show ' ,
         $css, '" role="alert">', $text, ($btnclose ? '<button type="button" ' .
         'class="btn-close outline-none box-shadow-none" data-bs-dismiss="'    .
         'alert"></button>' : ''), '</div>';
});
/*
| ------------------------------------------------------------------------------
| Language list
| ------------------------------------------------------------------------------
| {{ language_list() }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('language_list', function () {
    $language = array_filter(glob(PATH['app'] . '/languages/*'), 'is_dir');
    foreach ($language as $index => $value) {
        $arr = explode('/', $value);
        $language[$index] = end($arr);
    }
    return $language;
});
/*
| ------------------------------------------------------------------------------
| .md file interpreter
| ------------------------------------------------------------------------------
| {{ parsedown('/path/to/file.md')|raw }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('parsedown', function ($file) {
    $contents  = file_get_contents(PATH['app'] . $file);
    $Parsedown = new Parsedown();
    return $Parsedown->text($contents);
});
/*
| ------------------------------------------------------------------------------
| Get session
| ------------------------------------------------------------------------------
| {{ session('name') }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('session', function ($name) {
    return $_SESSION[$name];
});
/*
| ------------------------------------------------------------------------------
| Text translation
| ------------------------------------------------------------------------------
| {{ translate('Text...') }}
| ------------------------------------------------------------------------------
*/
Sciola\Template::twigFunction('translate', function ($text) {
    return Sciola\Language::translate($text);
});
