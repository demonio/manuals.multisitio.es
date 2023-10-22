<?php
/**
 */
class DocsController extends AppController
{
    # 0
    public function __call($name, $params)
    {
        array_unshift($params, $name);
        $this->page = implode('/', $params);
        $this->html = (new Docs)->read($this->page);
        View::select('read');
    }
}
