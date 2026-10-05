<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if(isset($_FILES["image"])) {
    $file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
    $new_filename = uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;
    
    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if($check !== false) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            echo json_encode(array("success" => true, "url" => "api/" . $target_file));
        } else {
            echo json_encode(array("success" => false, "message" => "Sorry, there was an error uploading your file."));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "File is not an image."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "No image file provided."));
}
?>
