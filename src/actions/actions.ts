import { Router } from 'express';
import { PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import TransactionBuilder from './build/build';
import BN from 'bn.js';
import { RPC_URL, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from './config';

const actionsRouter = Router();

actionsRouter.post('/donate-sol', async (req, res) => {
    try {
        const { account, amount, priority } = req.body;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const amountInLamports = Number(amount) * 1e9; // Convert SOL amount to lamports (1 SOL = 1e9 lamports)
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.SOL_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // SOL Treasury Address

        const solTransferIx = SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports: amountInLamports,
        });

        const txConfig = {
            rpc: RPC_URL,
            account,
            instructions: [solTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(RPC_URL);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} SOL!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

actionsRouter.post('/donate-usdc', async (req, res) => {
    try {
        const { account, amount, priority } = req.body;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const decimals = 6; // USDC has 6 decimal places
        const amountInLamports = new BN(Number(amount) * Math.pow(10, decimals)); // Convert USDC amount to lamports
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.USDC_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // USDC Treasury Address

        const usdcTransferIx = new TransactionInstruction({
            keys: [
                { pubkey: from, isSigner: true, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true }
            ],
            programId: TOKEN_2022_PROGRAM_ID,
            data: Buffer.concat([
                Buffer.from([1]), // Instruction index for transfer
                new BN(0).toArray('le', 32), // Source Token Account (must be adjusted)
                new BN(0).toArray('le', 32), // Destination Token Account (must be adjusted)
                amountInLamports.toArray('le', 8) // Amount in lamports (8 bytes)
            ]),
        });

        const txConfig = {
            rpc: RPC_URL,
            account,
            instructions: [usdcTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(RPC_URL);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} USDC!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

actionsRouter.post('/donate-bark', async (req, res) => {
    try {
        const { account, amount, priority } = req.body;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const decimals = 9; // BARK has 9 decimal places
        const amountInLamports = new BN(Number(amount) * Math.pow(10, decimals)); // Convert BARK amount to lamports
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.BARK_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // BARK Treasury Address

        const barkTransferIx = new TransactionInstruction({
            keys: [
                { pubkey: from, isSigner: true, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true }
            ],
            programId: TOKEN_PROGRAM_ID,
            data: Buffer.concat([
                Buffer.from([0]), // Instruction index for transfer
                amountInLamports.toArray('le', 8) // Amount in lamports (8 bytes)
            ]),
        });

        const txConfig = {
            rpc: RPC_URL,
            account,
            instructions: [barkTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(RPC_URL);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} BARK tokens!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

export default actionsRouter;
