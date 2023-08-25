<?php
require_once CORE_PATH . 'kumbia/controller.php';
/**
 */
abstract class AppController extends Controller
{
    final protected function initialize()
    {
        View::template('docs');
    }

    final protected function finalize()
    {
    }
}
