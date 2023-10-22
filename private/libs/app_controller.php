<?php
require_once CORE_PATH . 'kumbia/controller.php';
/**
 */
abstract class AppController extends Controller
{
    final protected function initialize()
    {
		$this->version = '23';
                
        Input::isAjax() ? View::template(null) : View::template('docs');
    }

    final protected function finalize()
    {
    }
}
