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
            list($username, $email) = explode(',', $line);
            $db->insertUserQuery(["user" => $username, "password" => 'pass', "email" => $email, "admin" => false]);
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
