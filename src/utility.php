<?php
    function testInput($input) {
        $input = trim($input);
        $input = htmlspecialchars($input);
        $input = stripslashes($input);

        return $input;
    }
