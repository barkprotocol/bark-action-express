import fetch from 'node-fetch';
import { Connection } from '@solana/web3.js';
import { RPC_URL } from '../config';

// Define the API endpoint for fetching compute unit prices
const COMPUTE_UNIT_PRICE_ENDPOINT = `${RPC_URL}`; // Adjust as necessary

/**
 * Fetch the current compute unit price from the Solana RPC.
 * 
 * @param connection - The Solana connection object.
 * @returns The current compute unit price in micro-lamports.
 */
export async function fetchComputeUnitPrice(connection: Connection): Promise<number> {
    try {
        // Example JSON RPC request for compute unit price
        const response = await fetch(COMPUTE_UNIT_PRICE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: '1',
                method: 'getRecentBlockhash', // Adjust this to the actual method if available
            }),
        });

        const data = await response.json();
        console.log("Compute Unit Price Response:", data);

        // Handle response
        if (data && data.result && data.result.value && typeof data.result.value === 'object') {
            // Example extraction - adjust based on actual response structure
            const { blockhash, feeCalculator } = data.result.value;
            if (feeCalculator && feeCalculator.lamportsPerSignature) {
                return feeCalculator.lamportsPerSignature; // Return fee per signature
            } else {
                throw new Error('Invalid response structure or compute unit price not found');
            }
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching compute unit price:', error);
        throw new Error('Failed to fetch compute unit price');
    }
}
