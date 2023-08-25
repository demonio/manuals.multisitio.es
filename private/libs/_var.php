<?php
/**
 */
class _var
{
    # 1
    static public function die($var, $no_tags=0)
    {
        $allowed_IP = Config::get('exception.trustedIp');
        if ( ! in_array($_SERVER['REMOTE_ADDR'], $allowed_IP)) {
            return;
        }

        echo round((microtime(1) - $_SERVER['REQUEST_TIME_FLOAT'])*1000, 4) . ' ms<hr>';
        echo ($var) ? '<h3>RESULT</h3>' : '<h3>EMPTY</h3>';
        self::echo($var, $no_tags);
        die;
    }
    
    # 1.1
    static public function echo($var, $no_tags=0)
    {
		echo self::return($var, $no_tags);
	}
    
	# 1.2
    static public function return($var, $no_tags=0)
    {
        if ($no_tags) {
            if (is_array($var)) {
                array_walk_recursive($var, function (&$value) {
                    $value = str_replace('<', '&lt;', $value);
                });
            }
            elseif (is_bool($var)) {
                $var = ($var === TRUE) ? 'TRUE' : 'FALSE';
            }
            elseif (is_null($var)) {
                $var = 'NULL';
            }
            else {
                $var = str_replace('<', '&lt;', $var);
            }
            return '<hr><pre>' . print_r($var, 1) . '</pre>';
        }

        if (is_bool($var)) {
            $var = ($var === TRUE) ? 'TRUE' : 'FALSE';
        }
        elseif (is_null($var)) {
            $var = 'NULL';
        }

        /*if (is_object($var)) {
            $var = (array)$var;
        }*/
        return '<hr><pre>' . print_r($var, 1) . '</pre>';
    }

    # 2
	static public function flush($str='')
	{
        if ( ! ob_get_level()) {
            ob_start();
        }
        if ($str) {
            _var::echo([$str, '<script>window.scrollTo({left:0, top:document.body.scrollHeight, behavior:"smooth"});</script>']);
        }              
        flush();
        ob_end_flush();
	}
}
