<?php
/**
 * File
 *
 * @version 1.0.1
 */
namespace Sciola;

class File
{
    /**
     * Get file count
     *
     * File::getCount('/path/to/dir');
     *
     * @param string $path
     * @return void
     * @access public
     */
    public static function getCount($path)
    {
        $folder = true;
        $size   = 0;
        $ignore = array('.','..');
        $files  = scandir($path);
        foreach($files as $t) {
            if(in_array($t, $ignore)) continue;
            $dir = rtrim($path, '/') . '/' . $t;
            if (!is_link($dir) && is_dir($dir)) {
                $size += self::getCount($dir);
            } else if (!$folder) {
                $size++;
            }
            if ($folder) {
                $size++;
            }
        }
        return $size;
    }

    /**
     * Get static files
     *
     * @param string $path
     * @return void
     * @access public
     */
    public static function getStaticFile($path) : void
    {
        if (file_exists($path)) {
            $type = self::getMimeType(pathinfo($path, PATHINFO_EXTENSION));
            self::serveStaticFile($path, array(
                'headers' => array(
                    'Content-Type'  => $type,
                    'Cache-Control' => 'public, max-age=604800',
                    'Expires'       => gmdate('D, d M Y H:i:s',
                                              time() + 30 * 86400) . ' GMT'
                )
            ));
        } else {
            Route::error(404);
        }
        exit;
    }

    /**
     * Get all PHP files from a directory
     *
     * @param string $path
     * @return void
     * @access public
     */
    public static function getAllFilesDir($path) : void
    {
        $list = glob($path . '/*');
        foreach ($list as $item) {
            if (is_file($item) && (pathinfo($item)['extension'] === 'php')) {
                require_once $item;
            } elseif (is_dir($item)) {
                self::getAllFilesDir($item);
            }
        }
    }

    /**
     * Get mime type
     *
     * @param string $ext
     * @return string
     * @access private
     */
    private static function getMimeType($ext) : string
    {
        $type = array(
            'css'   => 'text/css',
            'js'    => 'application/javascript',
            'json'  => 'application/json',
            'xml'   => 'application/xml',
            'txt'   => 'text/plain',
            'html'  => 'text/html',
            'ttf'   => 'application/x-font-ttf',
            'woff'  => 'application/font-woff',
            'woff2' => 'application/font-woff2',
            'png'   => 'image/png',
            'jpe'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'jpg'   => 'image/jpeg',
            'gif'   => 'image/gif',
            'bmp'   => 'image/bmp',
            'ico'   => 'image/vnd.microsoft.icon',
            'tiff'  => 'image/tiff',
            'tif'   => 'image/tiff',
            'svg'   => 'image/svg+xml',
            'svgz'  => 'image/svg+xml',
            'zip'   => 'application/zip',
            'pdf'   => 'application/pdf',
            'mp3'   => 'audio/mpeg'
        );
        return $type[$ext];
    }

    /**
     * Serve static file
     *
     * @param string $path
     * @param array $options
     * @access private
     */
    private static function serveStaticFile($path, $options = array())
    {
        $path = realpath($path);
        if (is_file($path)) {
            if (session_id()) {
                session_write_close();
            }
            header_remove();
            set_time_limit(0);
            $size = filesize($path);
            $lastModifiedTime = filemtime($path);
            $fp = @fopen($path, 'rb');
            $range = array(0, $size - 1);
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s',
                    $lastModifiedTime)." GMT");
            if ((!empty($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
                strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) ==
                $lastModifiedTime)) {
                header("HTTP/1.1 304 Not Modified", true, 304);
                return true;
            }
            if (isset($_SERVER['HTTP_RANGE'])) {
                /*$valid = preg_match('^bytes=\d*-\d*(,\d*-\d*)*$',
                                      $_SERVER['HTTP_RANGE']);*/
                if(substr($_SERVER['HTTP_RANGE'], 0, 6) != 'bytes=') {
                    header('HTTP/1.1 416 Requested Range Not Satisfiable', true,
                            416);
                    header('Content-Range: bytes */' . $size); /* Required in
                                                                  416 */
                    return false;
                }
                $ranges = explode(',', substr($_SERVER['HTTP_RANGE'], 6));
                $range = explode('-', $ranges[0]); /* to do: only support the
                                                      first range now.*/

                if ($range[0] === '') $range[0] = 0;
                if ($range[1] === '') $range[1] = $size - 1;

                if (($range[0] >= 0) && ($range[1] <= $size - 1) &&
                    ($range[0] <= $range[1])) {
                    header('HTTP/1.1 206 Partial Content', true, 206);
                    header('Content-Range: bytes ' . sprintf('%u-%u/%u',
                            $range[0], $range[1], $size));
                } else {
                    header('HTTP/1.1 416 Requested Range Not Satisfiable', true,
                            416);
                    header('Content-Range: bytes */' . $size);
                    return false;
                }
            }
            $contentLength = $range[1] - $range[0] + 1;
            //header('Content-Disposition: attachment; filename="xxxxx"');
            $headers = array(
                'Accept-Ranges'  => 'bytes',
                'Content-Length' => $contentLength,
                'Content-Type'   => 'application/octet-stream'
            );
            if(!empty($options['headers'])) {
                $headers = array_merge($headers, $options['headers']);
            }
            foreach($headers as $k=>$v) {
                header("$k: $v", true);
            }
            if ($range[0] > 0) {
                fseek($fp, $range[0]);
            }
            $sentSize = 0;
            while (!feof($fp) && (connection_status() === CONNECTION_NORMAL)) {
                $readingSize = $contentLength - $sentSize;
                $readingSize = min($readingSize, 512 * 1024);
                if($readingSize <= 0) break;

                $data = fread($fp, $readingSize);
                if(!$data) break;
                $sentSize += strlen($data);
                echo $data;
                flush();
            }
            fclose($fp);
            return true;
        } else {
            header('HTTP/1.1 404 Not Found', true, 404);
            return false;
        }
    }
}
