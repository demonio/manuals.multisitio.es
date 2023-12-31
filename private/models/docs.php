<?php
/**
 */
class Docs extends LiteRecord
{
    # 1
    public function read($page)
    {
        #_var::die("$page");
        $pages = explode('/', $page, 2);
        $doc = $pages[0];
        $page = $pages[1] ?? 'readme.md';

        $url = Config::get("docs.$doc.doc");
        if ( ! str_ends_with($page, '.md')) {
            $page .= '/readme.md';
        }
        $md = file_get_contents("$url/$page");
        $html = (new Parsedown)->text($md);
        $href = "/docs/$doc/".dirname($page).'/';
        return str_replace('href="', 'href="'.$href, $html);
    }
}
