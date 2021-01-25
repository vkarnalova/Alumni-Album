<?php
function badgeIsValid($badgeData) {
    if(isEmpty($badgeData["title"])) {
        return "Missing input - title";
    }

    if(isEmpty($badgeData["iconId"])) {
        return "Missing input - iconId";
    }

    if(isTooLong($badgeData["title"], 30)) {
        return "Too long input - title";
    }

    if(isTooLong($badgeData["description"], 255)) {
        return "Too long input - description";
    }
    return null;
}

function isEmpty($field) {
    return $field == "";
}

function isTooLong($field, $maxLength) {
    return mb_strlen($field) > $maxLength;
}

function addBadgeToDatabase($badgeData) {
    $db = new Database();
    $query = $db->insertBadge($badgeData);

    if ($query["success"]) {
        return ["success" => true];
    } else {
        return ["success" => false];
    }
}

?>
