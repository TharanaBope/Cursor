const Producer = require('../services/producerService');
const Consumer = require('../services/consumerService');
const TicketPool = require('../services/ticketPoolService');
const Configuration = require('../models/configModel');
const socket = require('../config/socket');

class SystemController {
    constructor() {
        this.producers = new Map();
        this.consumers = new Map();
        this.ticketPool = null;
        this.currentConfig = null;
        this.isRunning = false;
        this.stateUpdateInterval = null;
    }

    async startSystem(req, res) {
        try {
            if (this.isRunning) {
                return res.status(400).json({ message: 'System is already running' });
            }

            const configId = req.body.configId;
            if (!configId) {
                return res.status(400).json({ message: 'Configuration ID is required' });
            }

            const config = await Configuration.getById(configId);
            if (!config) {
                return res.status(404).json({ message: 'Configuration not found' });
            }

            this.currentConfig = config;
            this.ticketPool = new TicketPool(config.max_ticket_capacity, config.total_tickets);

            // Initialize producers
            for (let i = 0; i < config.num_producers; i++) {
                const producer = new Producer(
                    i,
                    this.ticketPool,
                    config.ticket_release_rate
                );
                this.producers.set(i, producer);
                producer.start();
            }

            // Initialize consumers
            for (let i = 0; i < config.num_consumers; i++) {
                const consumer = new Consumer(
                    i,
                    this.ticketPool,
                    config.customer_retrieval_rate
                );
                this.consumers.set(i, consumer);
                consumer.start();
            }

            this.isRunning = true;
            
            // Emit initial state
            this.emitSystemState();
            
            // Start periodic state updates
            this.startStateUpdates();

            res.json({ message: 'System started successfully', state: this.getSystemState() });
        } catch (error) {
            console.error('Error starting system:', error);
            res.status(500).json({ message: 'Failed to start system' });
        }
    }

    async stopSystem(req, res) {
        try {
            if (!this.isRunning) {
                return res.status(400).json({ message: 'System is not running' });
            }

            // Stop all producers
            for (const producer of this.producers.values()) {
                producer.stop();
            }
            this.producers.clear();

            // Stop all consumers
            for (const consumer of this.consumers.values()) {
                consumer.stop();
            }
            this.consumers.clear();

            this.ticketPool = null;
            this.currentConfig = null;
            this.isRunning = false;

            // Emit final state
            this.emitSystemState();

            // Clear state update interval
            if (this.stateUpdateInterval) {
                clearInterval(this.stateUpdateInterval);
                this.stateUpdateInterval = null;
            }

            res.json({ message: 'System stopped successfully' });
        } catch (error) {
            console.error('Error stopping system:', error);
            res.status(500).json({ message: 'Failed to stop system' });
        }
    }

    getSystemState() {
        return {
            isRunning: this.isRunning,
            ticketPool: this.ticketPool ? {
                available: this.ticketPool.getAvailableTickets(),
                capacity: this.ticketPool.getCapacity(),
                totalSold: this.ticketPool.getTotalSold()
            } : null,
            producers: Array.from(this.producers.values()).map(p => ({
                id: p.id,
                isRunning: p.isRunning
            })),
            consumers: Array.from(this.consumers.values()).map(c => ({
                id: c.id,
                isRunning: c.isRunning
            })),
            currentConfig: this.currentConfig
        };
    }

    emitSystemState() {
        const state = this.getSystemState();
        socket.getIO().emit('systemState', state);
    }

    startStateUpdates() {
        // Clear any existing interval
        if (this.stateUpdateInterval) {
            clearInterval(this.stateUpdateInterval);
        }

        // Update state every second
        this.stateUpdateInterval = setInterval(() => {
            this.emitSystemState();
        }, 1000);
    }

    async getState(req, res) {
        try {
            const state = this.getSystemState();
            res.json(state);
        } catch (error) {
            console.error('Error getting system state:', error);
            res.status(500).json({ message: 'Failed to get system state' });
        }
    }
}

// Create singleton instance
const systemController = new SystemController();
module.exports = systemController;