<?php
/*
| ------------------------------------------------------------------------------
| Route
| ------------------------------------------------------------------------------
*/
function base_route($route) {
    return Sciola\Route::base($route);
}
/*
| ------------------------------------------------------------------------------
| MVC
| ------------------------------------------------------------------------------
*/
function controller($_class) {
    return Sciola\Layer::controller($_class);
}
function model($_class) {
    return Sciola\Layer::model($_class);
}
function view($file, $data = []) {
    return Sciola\Layer::view($file, $data);
}
/*
| ------------------------------------------------------------------------------
| Translate
| ------------------------------------------------------------------------------
*/
function translate($text) {
    return Sciola\Language::translate($text);
}
/*
| ------------------------------------------------------------------------------
| Currency formatting
| ------------------------------------------------------------------------------
| echo currency_formatting('1.200,00'); // 1200.00
| ------------------------------------------------------------------------------
*/
function currency_formatting($value) {
    return str_replace(array('.', ','), array('', '.'), $value);
}
/*
| ------------------------------------------------------------------------------
| File (.tar & .zip)
| ------------------------------------------------------------------------------
| tar('/path/to/dir', '/path/to/dir/file.tar');
| zip('/path/to/dir', '/path/to/dir/file.zip');
| ------------------------------------------------------------------------------
*/
function tar($dir, $out) {
    $Tar = new Tar;
    $Tar->generate($dir, $out);
}
function zip($dir, $out) {
    $Zip = new Zip;
    $Zip->generate($dir, $out);
}
/*
| ------------------------------------------------------------------------------
| Video Stream
| ------------------------------------------------------------------------------
| video_stream('/path/to/file.mp4');
| ------------------------------------------------------------------------------
*/
function video_stream($file) {
    $stream = new VideoStream($file);
    $stream->start();
}
/*
| ------------------------------------------------------------------------------
| Previous date
| ------------------------------------------------------------------------------
*/
function previous_date() {
    $date = strtotime('now');
    $date = date('Y-m-d', $date);
    $date = strtotime($date);
    $date = strtotime('-1 day', $date);
    $date = date('Y-m-d', $date);
    return $date;
}
