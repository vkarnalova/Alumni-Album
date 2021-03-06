<?php
require_once "utility.php";
require_once "db.php";
require_once "badge.php";
require_once "user.php";

header("Content-type: application/json");
session_start();
$requestURL = $_SERVER["REQUEST_URI"];

if (preg_match("/register$/", $requestURL)) {
    register();
} else if (preg_match("/login$/", $requestURL)) {
    login();
} else if (preg_match("/upload$/", $requestURL)) {
    upload();
} else if (preg_match("/search$/", $requestURL)) {
    search();
} else if (preg_match("/add-badge$/", $requestURL)) {
    addBadge();
} else if (preg_match("/show-badges/", $requestURL)) {
    showFriendBadges();
} else if (preg_match("/show-my-badges$/", $requestURL)) {
    showMyBadges();
} else if (preg_match("/get-user$/", $requestURL)) {
    getMyUserPersonalInfo();
} else if (preg_match("/update-user$/", $requestURL)) {
    updateUserPersonalInfo();
} else if (preg_match("/avatar$/", $requestURL)) {
    addAvatar();
} else if (preg_match("/displayUser$/", $requestURL)) {
    displayUser();
} else if (preg_match("/findUsers$/", $requestURL)) {
    findUsers();
} else if (preg_match("/show-personal-information/", $requestURL)) {
    showPersonalInformation($requestURL);
} else {
    echo json_encode(["success" => false, "error" => "URL not found"]);
}

function register()
{
    $errors = [];
    $response = [];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $filePath = $_FILES['file']['tmp_name'];
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
            $errors[] = "Невалиден формат.";
        } else {
            // Move file
            $fileNameUniqId = md5_file($_FILES['file']['tmp_name']);
            $filePath = sprintf('../uploads/%s.%s', $fileNameUniqId, $ext);

            if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
                $tags = json_decode($_POST["tags"]);
                $photosInfo = json_decode($_POST["photosInfo"]);
                $exifData = exif_read_data($filePath, "IFDO", 0);
                $date = null;
                if (isset($exifData["DateTime"])) {
                    $date = convertToSqlDatetime($exifData["DateTime"]);
                }
                $user = $_SESSION["username"];
                $addPhotoResult = addPhotoToDatabase($fileNameUniqId . '.' . $ext, $tags, $photosInfo, $date, $user);
                if (!$addPhotoResult["success"]) {
                    $errors[] = $addPhotoResult["data"];
                }
            } else {
                $errors[] = 'Failed to move uploaded file.';
            }
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        if (isset($_FILES['file'])) {
            array_push($errors, $_FILES['file']['name']);
        }
        $response = ["success" => false, "error" => $errors];
    } else {
        $response = ["success" => true, "data" => $_FILES['file']['name']];
    }

    echo json_encode($response);
}

function search()
{
    $errors = [];
    $response = [];
    if (isset($_POST)) {
        $major = isset($_POST["major"]) ? $_POST["major"] : "";
        $class = isset($_POST["class"]) ? $_POST["class"] : "";
        $potok = isset($_POST["potok"]) ? $_POST["potok"] : "";
        $groupNumber = isset($_POST["groupNumber"]) ? $_POST["groupNumber"] : "";
        $occasion = isset($_POST["occasion"]) ? $_POST["occasion"] : "";
        $date = isset($_POST["date"]) ? $_POST["date"] : "";
        $tags = isset($_POST["tags"]) ? json_decode($_POST["tags"]) : "";
        $data = ["major" => $major, "class" => $class, "potok" => $potok, "groupNumber" => $groupNumber, "occasion" => $occasion, "date" => $date, "tags" => $tags];
        $db = new Database();
        $files = getFiles($data, $db);

        if ($files["success"]) {
            $data = $files["data"];
        } else {
            $errors[] = $files["data"];
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    } else {
        $response = ["success" => true, "data" => $data];
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
    $subject = "Парола за Алумни Албум";
    $message = "Привет, " . "$username" . "! :)\n\nДобре дошли в Алумни Албум!\nПаролата за вашия потребителски профил е: " . "$password" . " .\n\nПоздрави\nЕкипа на Алумни Албум :)";

    mail($email, $subject, $message);
}

function addBadge()
{
    $errors = [];
    $response = [];

    if (isset($_POST)) {
        $assignedUser = $_POST["assignedUser"];
        $assigningUser = $_SESSION["username"];
        $title = $_POST["title"];
        $description = $_POST["description"];
        $iconId = $_POST["iconId"];
        $badgeData = ["assignedUser" => $assignedUser, "assigningUser" => $assigningUser, "title" => $title, "description" => $description, "iconId" => $iconId];

        $badgeIsValid = badgeIsValid($badgeData);
        if ($badgeIsValid != null) {
            $errors[] = $badgeIsValid;
        } else {
            addBadgeToDatabase($badgeData);
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

function showMyBadges()
{
    $errors = [];
    $response = [];

    $username = $_SESSION["username"];

    if ($username) {
        $response = showBadges($username);
    } else {
        $errors[] = "Invalid request";
    }

    echo json_encode($response);
}

function showFriendBadges()
{
    $errors = [];
    $response = [];

    if (isset($_POST)) {
        $user = $_POST["user"];

        $response = showBadges($user);
    } else {
        $errors[] = "Invalid request";
    }

    echo json_encode($response);
}

function showBadges($username)
{
    $errors = [];
    $response = [];

    $db = new Database();
    $query = $db->selectBadge(["assignedUser" => $username]);

    $listOfBadges = $query["data"]->fetchAll(PDO::FETCH_ASSOC);

    if ($query["success"]) {
        $response = ["success" => true, "data" => $listOfBadges];
    } else {
        $response = ["success" => false];
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    }

    return $response;
}

function getMyUserPersonalInfo()
{
    $errors = [];
    $response = [];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($_SESSION["username"]) {
            $username = $_SESSION["username"];
            $db = new Database();
            $query = $db->selectUserByUsernameQuery(["username" => $username]);

            if ($query["success"]) {
                $user = $query["data"]->fetch(PDO::FETCH_ASSOC);
                if ($user) {
                    // Do not send password info
                    unset($user['password']);
                } else {
                    $errors = 'Invalid user';
                }
            } else {
                $errors[] = $query;
            }
        } else {
            $errors[] = "You are not logged in.";
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "data" => $errors];
    } else {
        $response = ["success" => true, "data" => $user];
    }

    echo json_encode($response);
}

function updateUserPersonalInfo()
{
    $errors = [];
    $response = [];

    if ($_POST) {
        if ($_SESSION["username"]) {
            $username = $_SESSION["username"];

            $data = json_decode($_POST["data"], true);
            $query = updateUserInfo([
                "username" => $username, "potok" => $data["potok"],
                "groupNumber" => $data["groupNumber"], "phoneNumber" => $data["phoneNumber"],
                "address" => $data["address"], "additionalInfo" => $data["additionalInfo"]
            ]);

            if (!$query["success"]) {
                $errors[] = $query;
            }
        } else {
            $errors[] = "You are not logged in.";
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "data" => $errors];
    } else {
        $response = ["success" => true];
    }

    echo json_encode($response);
}

function addAvatar()
{
    $errors = [];
    $response = [];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($_SESSION["username"]) {
            $username = $_SESSION["username"];

            $result = addAvatarForUser($username);
            if (!$result['success']) {
                $errors = $result['error'];
            }
        } else {
            $errors[] = "You are not logged in.";
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "data" => $errors];
    } else {
        $response = ["success" => true];
    }

    echo json_encode($response);
}

function findUsers()
{
    $errors = [];
    $response = [];

    if (isset($_POST)) {
        $currentUser = $_SESSION["username"];
        $username = isset($_POST["username"]) ? $_POST["username"] : "";
        $data = ["currentUser" => $currentUser, "username" => $username];
        $db = new Database();
        $query = getUsers($data, $db);

        if ($query["success"]) {
            $response = ["success" => true, "data" => $query];
        } else {
            $response = ["success" => false];
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "error" => $errors];
    }

    echo json_encode($response);
}

function showPersonalInformation($requestURL)
{
    $errors = [];
    $response = [];

    if (isset($_GET)) {
        $username = extractUsernameFromUrl($requestURL);

        $db = new Database();
        $query = $db->selectUserByUsernameQuery(["username" => $username]);

        if ($query["success"]) {
            $user = $query["data"]->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                unset($user['password']);
            } else {
                $errors = 'Invalid user';
            }
        } else {
            $errors[] = $query;
        }
    } else {
        $errors[] = "Invalid request";
    }

    if ($errors) {
        $response = ["success" => false, "data" => $errors];
    } else {
        $response = ["success" => true, "data" => $user];
    }

    echo json_encode($response);
}

function displayUser()
{
    $errors = [];
    $response = [];

    if (isset($_GET)) {
        $username = getCurrentUser();


        if ($username) {
            $response = ["success" => true, "data" => $username];
        } else {
            $response = ["success" => false];
        }
    } else {
        $errors[] = "Invalid request";
        $response = ["success" => false, "data" => $errors];
    }

    echo json_encode($response);
}
