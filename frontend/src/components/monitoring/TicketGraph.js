import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import socketService from '../../services/socket';
import './TicketGraph.css';

const TicketGraph = React.memo(({ data = [] }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return [{ time: new Date().toLocaleTimeString(), available: 0, sold: 0 }];
        }
        return data.map(item => ({
            ...item,
            time: new Date(item.timestamp).toLocaleTimeString()
        }));
    }, [data]);

    return (
        <div className="ticket-graph">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time', position: 'bottom' }} 
                    />
                    <YAxis 
                        label={{ value: 'Tickets', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="available" 
                        stroke="#6e8efb" 
                        name="Available Tickets"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="sold" 
                        stroke="#a777e3" 
                        name="Sold Tickets"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

export default TicketGraph;