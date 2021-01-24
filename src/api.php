<?php
require_once "utility.php";
require_once "db.php";

header("Content-type: application/json");
session_start();
$requestURL = $_SERVER["REQUEST_URI"];

if (preg_match("/register$/", $requestURL)) {
    register();
} else if (preg_match("/login$/", $requestURL)) {
    login();
} else if (preg_match("/upload$/", $requestURL)) {
    upload();
} else {
    echo json_encode(["success" => false, "error" => "URL not found"]);
}

function register()
{
    $errors = [];
    $response = [];

    if ($_POST) {
        $data = json_decode($_POST["data"], true);

        $filePath = $data["filePath"];
        if (!registerUsers($filePath)) {
            $errors[] = "Error registering users";
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    } else {
        $response = ["success" => true, "data" => $filePath];
    }

    echo json_encode($response);
}

function registerUsers($filePath)
{
    $db = new Database();

    $handle = fopen($filePath, "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            // process the line 
            list($username, $email, $firstName, $familyName, $major, $class) = explode(',', $line);
            $pass = generateRandomPassword();
            $db->insertUserQuery([
                "user" => $username, "password" => $pass,
                "email" => $email, "admin" => false, "firstName" => $firstName,
                "familyName" => $familyName, "major" => $major, "class" => $class
            ]);
            mailPasswordToUser($username, $pass, $email);
        }

        fclose($handle);
        return true;
    } else {
        // error opening the file.
        return false;
    }
}

function login()
{
    $errors = [];
    $response = [];

    if ($_POST) {
        $data = json_decode($_POST["data"], true);

        $username = isset($data["username"]) ? testInput($data["username"]) : "";
        $password = isset($data["password"]) ? testInput($data["password"]) : "";
        $admin = isset($data["admin"]) ? $data["admin"] : false;

        if (!$username) {
            $errors[] = "Input username";
        }

        if (!$password) {
            $errors[] = "Input password";
        }

        if ($username && $password) {
            $isValidUser = isUserValid($username, $password, $admin);
            if ($isValidUser["success"]) {
                $_SESSION["username"] = $username;
            } else {
                $errors[] = $isValidUser["data"];
            }
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    } else {
        $response = ["success" => true];
    }

    echo json_encode($response);
}

function upload()
{
    $errors = [];
    $response = [];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $ext = array_search(
            $finfo->file($_FILES['file']['tmp_name']),
            array(
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
            ),
            true
        );

        if (!$ext) {
            $errors[] = "Invalid file format";
        } else {
            // Move file
            $tempFileNameWithoutExt = pathinfo($_FILES['file']['tmp_name'])['filename'];
            $fileNameUniqId = uniqid($tempFileNameWithoutExt);
            $filePath = sprintf('../uploads/%s.%s', $fileNameUniqId, $ext);

            if (!file_exists($filePath)) {
                if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
                    $tags = json_decode($_POST["tags"]);
                    $photosInfo = json_decode($_POST["photosInfo"]);

                    $addPhotoResult = addPhotoToDatabase($fileNameUniqId . '.' . $ext, $tags, $photosInfo);
                    if (!$addPhotoResult["success"]) {
                        $errors[] = $addPhotoResult["data"];
                    }
                } else {
                    $errors[] = 'Failed to move uploaded file.';
                }
            } else {
                $errors[] = "File alredy exists";
            }
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    } else {
        $response = ["success" => true];
    }

    echo json_encode($response);
}

function isUserValid($username, $password, $admin)
{
    $db = new Database();
    $query = $db->selectUserQuery(["username" => $username, "password" => $password, "admin" => $admin]);

    if ($query["success"]) {
        $user = $query["data"]->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            return ["success" => true];
        } else {
            return ["success" => false, "data" => 'Invalid user'];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}

function generateRandomPassword()
{
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array();
    $alphaLength = strlen($alphabet) - 1;
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode("", $pass);
}

function mailPasswordToUser($username, $password, $email)
{
    $subject = "Alumni Album Account Password";
    $message = "Привет, " . "$username" . "! :)\n\nДобре дошли в Алумни Албум!\nПаролата за вашия потребителски профил е: " . "$password" . " .\nВинаги можете да я смените по-късно от настройките на профила.\n\nПоздрави\nЕкипа на Алумни Албум :)";

    //mail($email, $subject, $message);
}
