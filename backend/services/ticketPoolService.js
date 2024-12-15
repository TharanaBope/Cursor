const socket = require('../config/socket');

class TicketPool {
    constructor(maxCapacity, totalTickets) {
        this.tickets = [];
        this.maxCapacity = maxCapacity;
        this.totalTickets = totalTickets;
        this.totalSold = 0;
        this.remainingTickets = totalTickets;
    }

    async addTicket() {
        if (this.remainingTickets <= 0) {
            return false; // No more tickets to add
        }

        if (this.tickets.length >= this.maxCapacity) {
            return false; // Pool is full
        }

        this.tickets.push({
            id: Date.now(),
            status: 'AVAILABLE'
        });

        this.remainingTickets--;
        this.emitState();
        return true;
    }

    async removeTicket() {
        if (this.tickets.length === 0) {
            return false; // Pool is empty
        }

        const ticket = this.tickets.shift();
        this.totalSold++;
        this.emitState();
        return ticket;
    }

    getAvailableTickets() {
        return this.tickets.length;
    }

    getTotalSold() {
        return this.totalSold;
    }

    getCapacity() {
        return this.maxCapacity;
    }

    getRemainingTickets() {
        return this.remainingTickets;
    }

    getState() {
        return {
            available: this.getAvailableTickets(),
            totalSold: this.getTotalSold(),
            capacity: this.getCapacity(),
            remainingTickets: this.getRemainingTickets(),
            totalTickets: this.totalTickets
        };
    }

    emitState() {
        const state = this.getState();
        socket.getIO().emit('ticketPoolUpdate', state);
    }
}

module.exports = TicketPool;