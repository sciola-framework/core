<?php
/**
 * Connection
 *
 * @version 1.0.2
 */
namespace Sciola;

use \PDO;
use Medoo\Medoo;

class Connection
{
    private static $instance = null;

    /**
     * getInstance
     *
     * @return object
     * @access private
     */
    private static function getInstance() : object
    {
        try {
            if (!isset(self::$instance)) {
                $config = self::config('pdo');
                if ($config['database'] === '') {
                    throw new \PDOException('Invalid database! Review the ' .
                    'access settings in the file: /config/<strong>connection.' .
                    'ini</strong>');
                }
                if (strtolower($config['driver']) === 'sqlite') {
                    self::$instance = new PDO('sqlite:' . PATH .
                                              '/writable/sqlite/' .
                                              $config['database'] . '.db');
                } else {
                    self::$instance = new PDO($config['dsn'],
                                              $config['username'],
                                              $config['password']);
                    self::$instance->setAttribute(PDO::ATTR_ERRMODE,
                                                  PDO::ERRMODE_EXCEPTION);
                }
            }
            return self::$instance;
        } catch (\PDOException $e) {
            echo '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">',
                 '<html><head><title>PDO - Connection</title></head><body>',
                 '<h1 style="background: #ccc; padding: 25px">',
                 'PDO - Connection Error', ($e->getCode()) ?
                 ': ' . $e->getCode() : '', '</h1><p>',
                 $e->getMessage(), '</p></body></html>';
            exit;
        }
    }

    /**
     * config
     *
     * @param string $interface
     * @return array
     * @access private
     */
    private static function config($interface) : array
    {
        $config = parse_ini_file(PATH . '/config/connection.ini', true);

        if ($interface === 'pdo' &&
            strtolower($config['driver']) !== 'sqlite') {
            if (strtolower($config['driver']) === 'mysql') {
                if (!$config['port']) {
                    $config['port'] = 3306;
                }
                $charset = ';charset=' . $config['charset'];
            } elseif (strtolower($config['driver']) === 'pgsql') {
                if (!$config['port']) {
                    $config['port'] = 5432;
                }
                $charset = ';options=\'--client_encoding=' .
                           $config['charset'] . '\'';
            }
            $config['dsn'] = $config['driver'] . ':host=' . $config['host'] .
                             ';port=' . $config['port'] .
                             ';dbname=' . $config['database'] . $charset;
        } elseif ($interface === 'orm') {
            if (strtolower($config['driver']) === 'sqlite') {
                $config = [
                  'type'     => 'sqlite',
                  'database' => PATH . '/writable/sqlite/' . $config['database']
                ];
            } else {
                $config = [
                  'database_type' => $config['driver'],
	              'server'        => $config['host'],
	              'database_name' => $config['database'],
	              'username'      => $config['username'],
	              'password'      => $config['password']
                ];
            }
        }
        return $config;
    }

    /**
     * pdo
     *
     * @return object
     * @access public
     */
    public static function pdo() : object
    {
        return self::getInstance();
    }

    /**
     * orm
     *
     * @return object
     * @access public
     */
    public static function orm() : object
    {
        return new Medoo(self::config('orm'));
    }
}
