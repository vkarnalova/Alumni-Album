<?php
require_once "db.php";

function testInput($input)
{
    $input = trim($input);
    $input = htmlspecialchars($input);
    $input = stripslashes($input);

    return $input;
}

function addPhotoToDatabase($fileName, $tags, $photosInfo)
{
    $db = new Database();

    if (!isPhotoUploaded($fileName, $db)) {
        $result = insertPhoto($fileName, $photosInfo, $db);
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

function insertPhoto($fileName, $photosInfo, $db)
{
    $query = $db->insertPhotoQuery([
        "name" => $fileName,
        "major" => $photosInfo->major,
        "class" => $photosInfo->class,
        "potok" => $photosInfo->potok,
        "groupNumber" => $photosInfo->groupNumber,
        "occasion" => $photosInfo->occasion
    ]);

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

function getFiles($data, $db) {
    
    
    $sql = generateQuery($data);
    $query = $db->selectPhotoByInputQuery($sql);
    if ($query["success"]) {
        $files = $query["data"]->fetch(PDO::FETCH_ASSOC);
        if ($files) {
            return ["success" => true, "data" => $files];
        } else {
            return ["success" => false, "data" => 'No files matching'];
        }
    } else {
        return ["success" => false, "data" => $query];
    }
}


function generateQuery($data) {
    $sql = "";
    if (!$data) {
        return "SELECT name FROM photos";
    } else if (!array_key_exists("tags", $data)) {
        $sql = "SELECT name FROM photos WHERE ";
    } else {
        $sql = "SELECT DISTINCT name FROM photos p JOIN photo_tag pt ON p.id = :pt.photoId JOIN tags t ON pt.tagId = :t.id WHERE ";
    }

    
    $first = True;
        
    foreach($data as $attribute => $value) {
        if (is_array($value)) {
            $first = True;
            $sql .= "(";
            foreach($data["tags"] as $tag) {
                if (!$first) {
                    $sql .= " OR ";
                }
                
                $first = False;
                $sql .= " t.text LIKE {$tag}";
            }

            $sql .= ")";
            break;
        } else if (!$first) {
            $sql .= " AND ";
        }
        
        $sql .=  $attribute ." = :". $value;
        $first = False;
    }

    

    return $sql;
    
}