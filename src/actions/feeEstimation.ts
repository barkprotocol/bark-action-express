import fetch from 'node-fetch';
import { Connection } from '@solana/web3.js';
import { RPC_URL } from '../config';

// Define the API endpoint for fetching fee estimates
const FEE_ESTIMATION_ENDPOINT = `${RPC_URL}`; // Adjust if you have a specific fee estimation endpoint

/**
 * Fetch the fee estimate for a transaction from the Solana RPC.
 * 
 * @param connection - The Solana connection object.
 * @param priorityLevel - The priority level for the transaction.
 * @param transaction - The serialized transaction data.
 * @returns The estimated fee in micro-lamports.
 */
export async function fetchFeeEstimate(connection: Connection, priorityLevel: string, transaction: string): Promise<number> {
    try {
        // Example JSON RPC request for fee estimation
        const response = await fetch(FEE_ESTIMATION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: '1',
                method: 'getFeeEstimator', // Adjust to the actual method name if available
                params: [
                    {
                        transaction,
                        options: { priorityLevel },
                    },
                ],
            }),
        });

        const data = await response.json();
        console.log("Fee Estimate Response:", data);

        // Handle response
        if (data && data.result && typeof data.result.fee === 'number') {
            return data.result.fee; // Return fee if it's a number
        } else {
            throw new Error('Invalid response structure or fee not found');
        }
    } catch (error) {
        console.error('Error fetching fee estimate:', error);
        throw new Error('Failed to fetch fee estimate');
    }
}
