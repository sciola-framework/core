<?php
/**
 * Model
 *
 * @version 1.0.3
 */
namespace Sciola;

class Model
{
    /**
     * __construct
     *
     * @access public
     */
    public function __construct()
    {

    }

    /**
     * ORM
     *
     * @access protected
     */
    protected function orm()
    {
        return Connection::orm();
    }

    /**
     * PDO
     *
     * @access protected
     */
    protected function pdo()
    {
        return Connection::pdo();
    }
}
