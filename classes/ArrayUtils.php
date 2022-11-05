<?php
/**
 * Class ArrayUtils
 *
 * Demo:
 *
 * $mapped_array = ArrayUtils::getInstance()
 *                           ->collect([1, 2, 3, 4])
 *                           ->map(function($iteration) {
 *                               return $iteration * 2;
 *                           });
 * print_r($mapped_array);
 *
 * Array
 * (
 *    [0] => 2
 *    [1] => 4
 *    [2] => 6
 *    [3] => 8
 * )
 *
 * $filter_array = ArrayUtils::getInstance()
 *                           ->collect([1, 2, 3, 4, 5])
 *                           ->filter(function($iteration) {
 *                               return ($iteration & 1);
 *                           });
 * print_r($filter_array);
 *
 * Array
 * (
 *    [0] => 1
 *    [1] => 3
 *    [2] => 5
 * )
 *
 * @version 1.0.2
 */
use Closure;

class ArrayUtils
{
    private $collection;

    /**
     * Returns the class instance
     *
     * @return ArrayUtils
     */
    public static function getInstance()
    {
        return new ArrayUtils();
    }

    /**
     * Collects the input array
     *
     * @param array $collection
     * @return $this
     */
    public function collect(array $collection)
    {
        $this->collection = $collection;
        return $this;
    }

    /**
     * Wrapper method for array_map
     *
     * @param Closure $closure
     * @return array
     */
    public function map(Closure $closure) : array
    {
        return array_map($closure, $this->collection);
    }

    /**
     * Wrapper method for array_filter
     *
     * @param Closure $closure
     * @return array
     */
    public function filter(Closure $closure) : array
    {
        return array_filter($this->collection, $closure);
    }

    /**
     * Wrapper method for in_array
     *
     * @param mixed $item
     * @return bool
     */
    public function contains(mixed $item) : bool
    {
        return in_array($item, $this->collection);
    }

    /**
     * Wrapper method for array_values
     *
     * @return array
     */
    public function getValues() : array
    {
        return array_values($this->collection);
    }

    /**
     * Wrapper method for array_keys
     *
     * @return array
     */
    public function getKeys() : array
    {
        return array_keys($this->collection);
    }

    /**
     * Wrapper method for array_search
     *
     * @param mixed $arg
     * @return false|int|string
     */
    public function search(mixed $arg, bool $strict = false) : int|string|false
    {
        return array_search($arg, $this->collection, $strict = false);
    }

    /**
     * Wrapper method for array_reduce
     *
     * @param Closure $callback
     * @param mixed $initial
     * 
     * @return mixed
     */
    public function reduce(Closure $callback, mixed $initial = null) : mixed
    {
        return array_reduce($this->collection, $callback, $initial);
    }

    /**
     * Wrapper method for array_chunk
     *
     * @param int $length
     * @param bool $preserve_keys
     * 
     * @return array
     */
    public function chunk(int $length, bool $preserve_keys = false) : array
    {
        return array_chunk($this->collection, $length, $preserve_keys);
    }
}
