const db = require('../config/database');

class Ticket {
    static async create(configId) {
        const [result] = await db.execute(
            'INSERT INTO tickets (configuration_id, status) VALUES (?, "AVAILABLE")',
            [configId]
        );
        return result.insertId;
    }

    static async updateStatus(ticketId, status) {
        await db.execute(
            'UPDATE tickets SET status = ? WHERE id = ?',
            [status, ticketId]
        );
    }

    static async getAvailableCount(configId) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM tickets WHERE configuration_id = ? AND status = "AVAILABLE"',
            [configId]
        );
        return rows[0].count;
    }
}

module.exports = Ticket; 