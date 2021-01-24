<?php
require_once "db.php";

function testInput($input)
{
    $input = trim($input);
    $input = htmlspecialchars($input);
    $input = stripslashes($input);

    return $input;
}

function addPhotoToDatabase($fileName, $tags)
{
    $db = new Database();

    if (!isPhotoUploaded($fileName, $db)) {
        $result = insertPhoto($fileName, $db);
        if (!$result["success"]) {
            return $result;
        } else {
            $photoId = $result["data"];
            return addTagsForPhoto($photoId, $tags, $db);
        }
    } else {
        return ["success" => false, "data" => "Photo already exists."];
    }
}

function isPhotoUploaded($fileName, $db)
{
    $query = $db->selectPhotoByNameQuery(["name" => $fileName]);

    if ($query["success"]) {
        $photo = $query["data"]->fetch(PDO::FETCH_ASSOC);
        return ($photo) ? true : false;
    } else {
        return false;
    }
}

function insertPhoto($fileName, $db)
{
    $query = $db->insertPhotoQuery(["name" => $fileName]);
    if ($query["success"]) {
        $data = $query["data"];
        if ($data) {
            return ["success" => true, "data" => $data];
        } else {
            return ["success" => false, "data" => 'Invalid photo'];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}

function getPhotoId($fileName, $db)
{
    $query = $db->selectPhotoByNameQuery(["name" => $fileName]);

    if ($query["success"]) {
        $photo = $query["data"]->fetch(PDO::FETCH_ASSOC);
        if ($photo) {
            return ["success" => true, "data" => $photo["id"]];
        } else {
            return ["success" => false, "data" => 'Invalid photo'];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}

function addTagsForPhoto($photoId, $tags, $db)
{
    $errors = [];
    for ($index = 0; $index < count($tags); $index++) {
        $addTagForPhotoResult = addTagForPhoto($photoId, $tags[$index], $db);
        if (!$addTagForPhotoResult["success"]) {
            array_push($errors, $addTagForPhotoResult["data"]);
        }
    }

    if ($errors) {
        return ["success" => false, "data" => $errors];
    } else {
        return ["success" => true];
    }
}

function addTagForPhoto($photoId, $tag, $db)
{
    $getTagIdResult = getTagId($tag, $db);
    if ($getTagIdResult["success"]) {
        if (array_key_exists("data", $getTagIdResult)) {
            $tagId = $getTagIdResult["data"];
        } else {
            // If the tag is not present, add id
            $addTagResult = addTag($tag, $db);

            if ($addTagResult["success"]) {
                $tagId = $addTagResult["data"];
            } else {
                return $addTagResult;
            }
        }

        // Add the tag for the photo
        return $db->insertTagForPhotoQuery(["photoId" => $photoId, "tagId" => $tagId]);
    } else {
        return $getTagIdResult;
    }
}

function getTagId($tag, $db)
{
    $query = $db->selectTagByTextQuery(["text" => $tag]);

    if ($query["success"]) {
        $tag = $query["data"]->fetch(PDO::FETCH_ASSOC);
        if ($tag) {
            return ["success" => true, "data" => $tag["id"]];
        } else {
            return ["success" => true];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}

function addTag($tag, $db)
{
    $query = $db->insertTagQuery(["text" => $tag]);

    if ($query["success"]) {
        $tagId = $query["data"];
        if ($tagId) {
            return ["success" => true, "data" => $tagId];
        } else {
            return ["success" => false];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}
