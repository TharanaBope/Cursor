const socket = require('../config/socket');

class Consumer {
    constructor(id, ticketPool, retrievalRate) {
        this.id = id;
        this.ticketPool = ticketPool;
        this.retrievalRate = retrievalRate;
        this.isRunning = false;
        this.ticketsConsumed = 0;
    }

    async start() {
        this.isRunning = true;
        this.consume();
    }

    async stop() {
        this.isRunning = false;
    }

    async consume() {
        while (this.isRunning) {
            try {
                const ticket = await this.ticketPool.removeTicket();
                if (ticket) {
                    this.ticketsConsumed++;
                    this.emitState();
                }
                await new Promise(resolve => setTimeout(resolve, this.retrievalRate));
            } catch (error) {
                console.error(`Consumer ${this.id} error:`, error);
                socket.getIO().emit('consumerError', { 
                    consumerId: this.id, 
                    error: error.message 
                });
            }
        }
    }

    getState() {
        return {
            id: this.id,
            ticketsConsumed: this.ticketsConsumed,
            isRunning: this.isRunning
        };
    }

    emitState() {
        socket.getIO().emit('consumerUpdate', this.getState());
    }
}

module.exports = Consumer; 