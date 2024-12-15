const db = require('../config/database');

class Configuration {
    static async create(config) {
        const {
            userId,
            numProducers,
            numConsumers,
            totalTickets,
            ticketReleaseRate,
            customerRetrievalRate,
            maxTicketCapacity
        } = config;

        const [result] = await db.execute(
            `INSERT INTO configurations 
            (user_id, num_producers, num_consumers, total_tickets, 
             ticket_release_rate, customer_retrieval_rate, max_ticket_capacity)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, numProducers, numConsumers, totalTickets, 
             ticketReleaseRate, customerRetrievalRate, maxTicketCapacity]
        );
        return result.insertId;
    }

    static async getUserConfigs(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM configurations WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async getById(configId) {
        const [rows] = await db.execute(
            'SELECT * FROM configurations WHERE id = ?',
            [configId]
        );
        return rows[0];
    }
}

module.exports = Configuration; 