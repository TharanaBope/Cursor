const socket = require('../config/socket');

class Producer {
    constructor(id, ticketPool, releaseRate) {
        this.id = id;
        this.ticketPool = ticketPool;
        this.releaseRate = releaseRate;
        this.isRunning = false;
        this.ticketsProduced = 0;
    }

    async start() {
        this.isRunning = true;
        this.produce();
    }

    async stop() {
        this.isRunning = false;
    }

    async produce() {
        while (this.isRunning) {
            try {
                const success = await this.ticketPool.addTicket();
                if (success) {
                    this.ticketsProduced++;
                    this.emitState();
                }
                await new Promise(resolve => setTimeout(resolve, this.releaseRate));
            } catch (error) {
                console.error(`Producer ${this.id} error:`, error);
                socket.getIO().emit('producerError', { 
                    producerId: this.id, 
                    error: error.message 
                });
            }
        }
    }

    getState() {
        return {
            id: this.id,
            ticketsProduced: this.ticketsProduced,
            isRunning: this.isRunning
        };
    }

    emitState() {
        socket.getIO().emit('producerUpdate', this.getState());
    }
}

module.exports = Producer; 