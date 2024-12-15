<?php
require_once '../config/database.php';
require_once '../src/Product.php';

// This will be our front controller
session_start();

// Basic routing
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/':
        require '../templates/home.php';
        break;
    case '/products':
        require '../templates/products.php';
        break;
    default:
        http_response_code(404);
        require '../templates/404.php';
        break;
}
?> 