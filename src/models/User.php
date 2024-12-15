<?php
require_once __DIR__ . '/../config/Database.php';

class User {
    private $db;
    private $table = 'users';

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($username, $password, $role, $email) {
        $query = "INSERT INTO " . $this->table . " 
                (username, password, role, email) 
                VALUES (:username, :password, :role, :email)";

        try {
            $stmt = $this->db->prepare($query);
            
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Bind parameters
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':role', $role);
            $stmt->bindParam(':email', $email);

            return $stmt->execute();
        } catch(PDOException $e) {
            die("Create user failed: " . $e->getMessage());
        }
    }

    public function login($username, $password) {
        $query = "SELECT * FROM " . $this->table . " WHERE username = :username";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($password, $row['password'])) {
                    return $row;
                }
            }
            return false;
        } catch(PDOException $e) {
            die("Login failed: " . $e->getMessage());
        }
    }
} 