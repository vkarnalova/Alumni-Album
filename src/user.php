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

function addAvatarForUser($username)
{
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $ext = array_search(
        $finfo->file($_FILES['file']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
        ),
        true
    );

    if (!$ext) {
        return ["success" => false, "error" => "Invalid file format"];
    } else {
        // Move file
        $filePath = sprintf('../avatars/%s.%s', $username, 'png');
        if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
            return  ["success" => true];
        } else {
            return ["success" => false, "error" => 'Failed to move uploaded file.'];
        }
    }
}
