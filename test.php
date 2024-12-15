<?php
require_once 'src/models/User.php';
require_once 'src/models/Configuration.php';

// Test User Creation
$user = new User();
$result = $user->create(
    'testuser',
    'password123',
    'vendor',
    'test@example.com'
);
echo $result ? "User created successfully\n" : "User creation failed\n";

// Test Login
$loginResult = $user->login('testuser', 'password123');
echo $loginResult ? "Login successful\n" : "Login failed\n";

// Test Configuration Creation
if ($loginResult) {
    $config = new Configuration();
    $configData = [
        'num_producers' => 2,
        'num_consumers' => 5,
        'total_tickets' => 100,
        'ticket_release_rate' => 10,
        'customer_retrieval_rate' => 5,
        'max_ticket_capacity' => 50
    ];
    
    $configResult = $config->create($loginResult['id'], $configData);
    echo $configResult ? "Configuration created successfully\n" : "Configuration creation failed\n";
} 