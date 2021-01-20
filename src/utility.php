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
    $result = $db->insertPhotoQuery(["name" => $fileName]);
    if (!$result["success"]) {
        return $result;
    } else {
        $photoIdResult = getPhotoId($fileName, $db);
        if (!$photoIdResult["success"]) {
            return $photoIdResult;
        } else {
            return addTagsForPhoto($photoIdResult["data"], $tags, $db);
        }
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
    for ($index = 0; $index < count($tags); $index++) {
        addTagForPhoto($photoId, $tags[$index], $db);
    }
}

function addTagForPhoto($photoId, $tag, $db)
{
    $getTagIdResult = getTagId($tag, $db);
    if ($getTagIdResult["success"]) {
        if (in_array("data", $getTagIdResult, true)) {
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
        $tag = $query["data"]->fetch(PDO::FETCH_ASSOC);
        if ($tag) {
            return ["success" => true, "data" => $tag["id"]];
        } else {
            return ["success" => false];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}
