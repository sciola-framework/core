<?php
/**
 * Controller
 *
 * @version 1.0.1
 */
namespace Sciola;

class Controller
{
    /**
     * __construct
     *
     * @access public
     */
    public function __construct()
    {
        if (method_exists($this, 'index')) {
            $this->index();
        }
    }
}
