<?php
require_once __DIR__ . '/../config/Database.php';

class Configuration {
    private $db;
    private $table = 'configurations';

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($userId, $data) {
        $query = "INSERT INTO " . $this->table . " 
                (user_id, num_producers, num_consumers, total_tickets, 
                ticket_release_rate, customer_retrieval_rate, max_ticket_capacity) 
                VALUES (:user_id, :num_producers, :num_consumers, :total_tickets,
                :ticket_release_rate, :customer_retrieval_rate, :max_ticket_capacity)";

        try {
            $stmt = $this->db->prepare($query);
            
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':num_producers', $data['num_producers']);
            $stmt->bindParam(':num_consumers', $data['num_consumers']);
            $stmt->bindParam(':total_tickets', $data['total_tickets']);
            $stmt->bindParam(':ticket_release_rate', $data['ticket_release_rate']);
            $stmt->bindParam(':customer_retrieval_rate', $data['customer_retrieval_rate']);
            $stmt->bindParam(':max_ticket_capacity', $data['max_ticket_capacity']);

            return $stmt->execute() ? $this->db->lastInsertId() : false;
        } catch(PDOException $e) {
            die("Create configuration failed: " . $e->getMessage());
        }
    }

    public function getActiveConfiguration() {
        $query = "SELECT * FROM " . $this->table . " WHERE status = 'active' ORDER BY created_at DESC LIMIT 1";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            die("Get configuration failed: " . $e->getMessage());
        }
    }
} 