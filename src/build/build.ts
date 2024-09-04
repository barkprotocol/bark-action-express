import {
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
    ComputeBudgetProgram,
    SystemProgram,
    TransactionInstruction
} from '@solana/web3.js';
import fetch from 'node-fetch';
import { RPC_URL, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '../config';
import BN from 'bn.js';

class TransactionBuilder {
    private connection: Connection;

    constructor(rpcUrl: string) {
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    async buildTransaction(config: any): Promise<any> {
        const { account, instructions, serialize = false, encode = false, priority = 'Medium', tolerance = 1.1, compute = true, fees = true } = config;

        if (!account || !instructions) {
            throw new Error('Missing required parameters');
        }

        const payer = new PublicKey(account);
        const { blockhash } = await this.connection.getLatestBlockhash('confirmed');

        if (compute) {
            const computeLimit = await this.computeUnitLimit(payer, instructions, tolerance, blockhash);
            instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units: computeLimit }));
        }

        if (fees) {
            const feeEstimate = await this.estimateFee(payer, priority, instructions, blockhash);
            instructions.unshift(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: feeEstimate }));
        }

        const msg = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();

        let tx = new VersionedTransaction(msg);

        if (serialize) {
            tx = tx.serialize();
        }

        if (encode) {
            tx = Buffer.from(tx).toString('base64');
        }

        return tx;
    }

    private async computeUnitLimit(payer: PublicKey, instructions: TransactionInstruction[], tolerance: number, blockhash: string): Promise<number> {
        const msg = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        const result = await this.connection.simulateTransaction(tx, { replaceRecentBlockhash: true, sigVerify: false });

        if (result.value.err) {
            throw new Error(`Error during simulation: ${result.value.logs}`);
        }

        return Math.ceil(result.value.unitsConsumed * tolerance);
    }

    private async estimateFee(payer: PublicKey, priority: string, instructions: TransactionInstruction[], blockhash: string): Promise<number> {
        const msg = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        const response = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: '1',
                method: 'getPriorityFeeEstimate',
                params: [
                    {
                        transaction: tx.serialize().toString('base64'),
                        options: { priorityLevel: priority },
                    },
                ],
            }),
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(`Error fetching fee estimate: ${data.error.message}`);
        }

        const feeEstimate = parseInt(data.result.priorityFeeEstimate, 10);
        return Math.max(feeEstimate, 10000); // Ensure fee is not below minimum
    }

    // Function to create SOL transfer instruction
    createSolTransferInstruction(from: PublicKey, to: PublicKey, amountInLamports: number): TransactionInstruction {
        return SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports: amountInLamports,
        });
    }

    // Function to create token transfer instruction
    createTokenTransferInstruction(from: PublicKey, to: PublicKey, amount: BN, programId: PublicKey): TransactionInstruction {
        return new TransactionInstruction({
            keys: [
                { pubkey: from, isSigner: true, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true },
            ],
            programId: programId,
            data: Buffer.concat([
                Buffer.from([1]), // Instruction index for transfer (change if necessary)
                amount.toArray('le', 8), // Amount in lamports (8 bytes)
            ]),
        });
    }
}

export default TransactionBuilder;
