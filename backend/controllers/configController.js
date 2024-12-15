const Configuration = require('../models/configModel');
const socket = require('../config/socket');

class ConfigController {
    static async createConfig(req, res) {
        try {
            const userId = req.userData.userId;
            const configData = {
                userId,
                ...req.body
            };

            const configId = await Configuration.create(configData);
            const config = await Configuration.getById(configId);
            socket.getIO().emit('newConfig', { config });

            res.status(201).json(config);
        } catch (error) {
            console.error('Configuration creation error:', error);
            res.status(500).json({ message: 'Error creating configuration' });
        }
    }

    static async getUserConfigs(req, res) {
        try {
            const userId = req.userData.userId;
            const configs = await Configuration.getUserConfigs(userId);
            res.json(configs);
        } catch (error) {
            console.error('Error fetching configurations:', error);
            res.status(500).json({ message: 'Error fetching configurations' });
        }
    }
}

module.exports = ConfigController; 