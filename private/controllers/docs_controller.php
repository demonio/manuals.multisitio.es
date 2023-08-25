<?php
/**
 */
class DocsController extends AppController
{
    # 0
    public function __call($name, $params)
    {
        array_unshift($params, $name);
        $page = implode('/', $params);
        $this->html = (new Docs)->read($page);
        View::select('read');
    }
}
