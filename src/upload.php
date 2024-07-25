<?php
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];
$allowedTypes = ['application/pdf', 'image/png'];
$allowedExtensions = ['pdf', 'png'];

if (isset($_FILES['files'])) {
    $uploadDir = __DIR__ . '/../uploads/';
    $fileCount = count($_FILES['files']['name']);
    $allFilesValid = true;

    // print_r($_FILES);
    // die;

    for ($i = 0; $i < $fileCount; $i++) {
        $fileTmpName = $_FILES['files']['tmp_name'][$i];
        $fileName = basename($_FILES['files']['name'][$i]);
        $fileType = mime_content_type($fileTmpName);
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $uploadFile = $uploadDir . $fileName;

        // Check for upload errors
        if ($_FILES['files']['error'][$i] === UPLOAD_ERR_INI_SIZE || $_FILES['files']['error'][$i] === UPLOAD_ERR_FORM_SIZE) {
            $response['message'] = 'File too large: ' . $fileName;
            $allFilesValid = false;
            break;
        }

        // Check file type
        if (!in_array($fileType, $allowedTypes) || !in_array($fileExtension, $allowedExtensions)) {
            $response['message'] = 'Invalid file type or extension: ' . $fileName;
            $allFilesValid = false;
            break;
        }

        // Try to move uploaded file
        if (!move_uploaded_file($fileTmpName, $uploadFile)) {
            $response['message'] = 'Failed to upload file: ' . $fileName;
            $allFilesValid = false;
            break;
        }
    }

    if ($allFilesValid) {
        $response['success'] = true;
        $response['message'] = 'Files uploaded successfully.';
    }
} else {
    $response['message'] = 'No files were uploaded.';
}

echo json_encode($response);
