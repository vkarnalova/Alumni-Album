<?php
require_once "db.php";

function updateUserInfo($data)
{
    $db = new Database();
    $sqlStatement = buildSqlStatement($data);

    return $db->updateUserInfoQuery($sqlStatement);
}

function buildSqlStatement($data)
{
    $statement = "UPDATE users SET ";
    foreach ($data as $key => $value) {
        if ($key != "username" && $value) {
            if (is_int($value)) {
                $statement .= $key . "=" . $value . ",";
            } else {
                $statement .= $key . "='" . $value . "',";
            }
        }
    }
    $statement = substr($statement, 0, -1) . " WHERE username='" . $data["username"] . "'";
    return $statement;
}
